import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  EcommerceCategory,
  EcommerceProduct,
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
} from "../types/ecommerce";
import { ecommerceService } from "@/services/ecommerce.service";
import { calculateDiscountedPrice, parsePrice } from "@/utils/priceUtils";

// Debounce utility for cart API calls
const debounceMap = new Map<string, NodeJS.Timeout>();

function debounceCartUpdate(
  key: string,
  fn: () => void | Promise<void>,
  delay: number = 500
) {
  // Clear existing timeout for this key
  const existingTimeout = debounceMap.get(key);
  if (existingTimeout) {
    clearTimeout(existingTimeout);
  }

  // Set new timeout
  const timeout = setTimeout(() => {
    fn();
    debounceMap.delete(key);
  }, delay);

  debounceMap.set(key, timeout);
}

interface LocalCartItem {
  productId: string;
  quantity: number;
}

const getAuthToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem("auth-token");
};

// Product Store State
interface ProductState {
  categories: EcommerceCategory[];
  products: EcommerceProduct[];
  filteredProducts: EcommerceProduct[];
  searchQuery: string;
  selectedCategory: string | null;
  loading: boolean;
  error: string | null;
}

// Product Store Actions
interface ProductActions {
  setCategories: (categories: EcommerceCategory[]) => void;
  setProducts: (products: EcommerceProduct[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  filterProducts: () => void;
  fetchCategories: () => Promise<void>;
  fetchProducts: (country?: string, searchTerm?: string) => Promise<void>;
}

// Cart Store State
interface CartState {
  cart: Cart | null;
  localCartItems: LocalCartItem[];
  itemCount: number;
  totalAmount: number;
  loading: boolean;
  cartLoading: boolean;
  error: string | null;
}

// Cart Store Actions
interface CartActions {
  setCart: (cart: Cart | null) => void;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  syncLocalCartToServer: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Combined Store
interface EcommerceStore
  extends ProductState,
    ProductActions,
    CartState,
    CartActions {}

const computeCartFromLocal = (
  localItems: LocalCartItem[],
  products: EcommerceProduct[],
  existingCart: Cart | null
): Cart | null => {
  if (!localItems.length) return null;

  const items = localItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;

      const originalPrice = parsePrice(product.price || '0').raw;
      const discountPercent = Number(product.discount_percentage) || 0;
      const unitPrice = calculateDiscountedPrice(originalPrice, discountPercent);
      const totalPrice = unitPrice * item.quantity;

      const existingItem = existingCart?.items.find(
        (i) => i.product.id === item.productId && !i.id.startsWith("local-")
      );

      const id = existingItem ? existingItem.id : `local-${product.id}`;

      return {
        id: id,
        product,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (!items.length) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.total_price, 0);
  let totalDiscount = 0;
  items.forEach((item) => {
    const disc =
      item.total_price *
      ((item.product.discount_percentage || 0) / 100);
    totalDiscount += disc;
  });
  const finalAmount = totalAmount - totalDiscount;

  return {
    id: existingCart?.id || "local-cart-id",
    items,
    total_amount: totalAmount,
    discount_percentage: totalDiscount,
    final_amount: finalAmount,
  } as Cart;
};

export const useEcommerceStore = create<EcommerceStore>()(
  persist(
    (set, get) => ({
      // Product State
      categories: [],
      products: [],
      filteredProducts: [],
      searchQuery: "",
      selectedCategory: null,
      loading: true,
      error: null,

      // Cart State
      cart: null,
      localCartItems: [],
      itemCount: 0,
      totalAmount: 0,
      cartLoading: false,

      // Product Actions
      setCategories: (categories) => set({ categories }),
      setProducts: (products) => set({ products }),
      setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().filterProducts();
      },
      setSelectedCategory: (categoryId) => {
        set({ selectedCategory: categoryId });
        get().filterProducts();
      },
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      filterProducts: () => {
        const { products, searchQuery, selectedCategory } = get();
        let filtered = products;

        if (searchQuery) {
          filtered = filtered.filter(
            (product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (product.description &&
                product.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())),
          );
        }

        if (selectedCategory) {
          filtered = filtered.filter(
            (product) => product.category.id === selectedCategory,
          );
        }

        set({ filteredProducts: filtered });
      },
      fetchCategories: async () => {
        try {
          const categories = await ecommerceService.getCategories();
          set({ categories });
        } catch (err: any) {
          console.error("Failed to fetch categories:", err);
          set({
            error: err.message || "Failed to fetch categories",
          });
        }
      },
      fetchProducts: async (country?: string, searchTerm?: string) => {
        try {
          const products = await ecommerceService.getProducts(searchTerm, country);
          set({ products, filteredProducts: products });
          const token = getAuthToken();
          if (!token) {
            const state = get();
            if (state.localCartItems.length > 0) {
              const computed = computeCartFromLocal(
                state.localCartItems,
                products,
                state.cart
              );
              state.setCart(computed);
            }
          }
        } catch (err: any) {
          console.error("Failed to fetch products:", err);
          set({
            error: err.message || "Failed to fetch products",
          });
        }
      },

      // Cart Actions
      setCart: (cart) => {
        if (cart && !cart.items) {
          cart.items = [];
        }
       
        if (!cart || !cart.items || cart.items.length === 0) {
          set({
            cart: cart,
            itemCount: 0,
            totalAmount: 0,
          });
          return;
        }
        set({
          cart,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
          totalAmount: cart.final_amount,
        });
      },
      fetchCart: async () => {
        const token = getAuthToken();
        const { localCartItems, products } = get();
        set({ cartLoading: true });
        
        if (!token) {
          const computed = computeCartFromLocal(localCartItems, products, get().cart);
          get().setCart(computed);
          set({ cartLoading: false });
          return;
        }
        
        try {
          const serverCart = await ecommerceService.getCart();
          get().setCart(serverCart);

          if (serverCart && Array.isArray(serverCart.items)) {
            set({
              localCartItems: serverCart.items.map((item: any) => ({
                productId: item.product.id,
                quantity: item.quantity,
              })),
            });
          } else {
            set({ localCartItems: [] });
          }
        } catch (err: any) {
          console.error("Failed to fetch cart:", err);
          if (err.response && err.response.status === 404) {
            get().setCart(null);
            set({ localCartItems: [] });
          } else {
            set({ error: err.message || "Failed to fetch cart" });
          }
        } finally {
          set({ cartLoading: false });
        }
      },
      addToCart: async (productId: string, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.localCartItems.findIndex(
            (item) => item.productId === productId
          );
          let updatedLocalItems: LocalCartItem[];
          if (existingItemIndex > -1) {
            const updated = [...state.localCartItems];
            updated[existingItemIndex].quantity += quantity;
            updatedLocalItems = updated;
          } else {
            updatedLocalItems = [
              ...state.localCartItems,
              { productId, quantity },
            ];
          }
          const computed = computeCartFromLocal(
            updatedLocalItems,
            state.products,
            state.cart
          );
          get().setCart(computed);
          return { localCartItems: updatedLocalItems };
        });

        const token = getAuthToken();
        if (!token) return;
        try {
          const data: AddToCartRequest = { product_id: productId, quantity };
          const updatedCart = await ecommerceService.addToCart(data);
          get().setCart(updatedCart);
          if (updatedCart && Array.isArray(updatedCart.items)) {
            set({
              localCartItems: updatedCart.items.map((item: any) => ({
                productId: item.product.id,
                quantity: item.quantity,
              })),
            });
          }
        } catch (err: any) {
          console.error("Failed to add to cart:", err);
          get().set({ error: err.message || "Failed to add to cart" });
          get().fetchCart();
        }
      },
      updateCartItem: async (itemId: string, quantity: number) => {
        const token = getAuthToken();
        const { cart, products } = get();
       
        const itemToUpdate = cart?.items.find((item: any) => item.id === itemId);
        if (!itemToUpdate) {
          console.error("updateCartItem: Item not found in state.");
          return;
        }
        const productId = itemToUpdate.product.id;
        let serverIdForApi: string | null = null;
        if (token) {
          const serverItem = cart?.items.find(
            (item: any) => item.product.id === productId && !item.id.startsWith("local-")
          );
          if (serverItem) {
            serverIdForApi = serverItem.id;
          }
        }
        if (quantity <= 0) {
          set((state) => {
            const updated = state.localCartItems.filter(
              (i) => i.productId !== productId
            );
            const computed = computeCartFromLocal(updated, state.products, state.cart);
            get().setCart(computed);
            return { localCartItems: updated };
          });
          if (token && serverIdForApi) {
            ecommerceService.removeFromCart(serverIdForApi)
              .then(() => get().fetchCart())
              .catch((err: any) => {
                console.error("Failed to remove from cart:", err);
                get().set({ error: err.message || "Failed to remove from cart" });
                get().fetchCart();
              });
          } else if (token) {
            console.warn("updateCartItem(remove): Item only existed locally. No API call needed.");
          }
          return;
        }
        // Optimistic update - update UI immediately
        set((state) => {
          const index = state.localCartItems.findIndex(
            (i) => i.productId === productId
          );
          if (index === -1) return state;
          const updated = [...state.localCartItems];
          updated[index].quantity = quantity;
          const computed = computeCartFromLocal(updated, state.products, state.cart);
          get().setCart(computed);
          return { localCartItems: updated };
        });

        // Debounced API call - only sync to server after user stops clicking
        if (token) {
          const debounceKey = `update-${productId}`;
          // Capture current values for the debounced function
          const currentServerId = serverIdForApi;
          const currentQuantity = quantity;
          debounceCartUpdate(debounceKey, async () => {
            // Get the latest quantity from local state (in case it changed during debounce)
            const latestState = get();
            const latestItem = latestState.localCartItems.find((i) => i.productId === productId);
            const finalQuantity = latestItem?.quantity || currentQuantity;
            
            // Find the latest server ID (in case cart was synced)
            const latestCart = latestState.cart;
            const latestServerItem = latestCart?.items.find(
              (item: any) => item.product.id === productId && !item.id.startsWith("local-")
            );
            const finalServerId = latestServerItem?.id || currentServerId;

            if (finalServerId) {
              const data: UpdateCartItemRequest = { quantity: finalQuantity };
              try {
                await ecommerceService.updateCartItem(finalServerId, data);
                await get().fetchCart();
              } catch (err: any) {
                console.error("Failed to update cart item:", err);
                get().set({ error: err.message || "Failed to update cart item" });
                await get().fetchCart();
              }
            } else {
              const data: AddToCartRequest = { product_id: productId, quantity: finalQuantity };
              try {
                await ecommerceService.addToCart(data);
                await get().fetchCart();
              } catch (err: any) {
                console.error("Failed to add new item via update:", err);
                get().set({ error: err.message || "Failed to add item" });
                await get().fetchCart();
              }
            }
          }, 500);
        }
      },
      removeFromCart: async (itemId: string) => {
        const token = getAuthToken();
        const { cart, products } = get();
        const itemToRemove = cart?.items.find((item: any) => item.id === itemId);
        if (!itemToRemove) {
          console.error("removeFromCart: Item not found in state.");
          return;
        }
        const productId = itemToRemove.product.id;
        let serverIdForApi: string | null = null;
        if (token) {
          const serverItem = cart?.items.find(
            (item: any) => item.product.id === productId && !item.id.startsWith("local-")
          );
          if (serverItem) {
            serverIdForApi = serverItem.id;
          }
        }
        set((state) => {
          const updated = state.localCartItems.filter(
            (i) => i.productId !== productId
          );
          const computed = computeCartFromLocal(updated, state.products, state.cart);
          get().setCart(computed);
          return { localCartItems: updated };
        });
        if (token && serverIdForApi) {
          ecommerceService.removeFromCart(serverIdForApi)
            .then(() => get().fetchCart())
            .catch((err: any) => {
              // If 404, item might already be deleted - just refresh cart to sync
              if (err.response?.status === 404) {
                console.warn("Item not found on server (may already be deleted), syncing cart...");
                get().fetchCart();
              } else {
                console.error("Failed to remove item from cart:", err);
                get().set({ error: err.message || "Failed to remove item from cart" });
                get().fetchCart();
              }
            });
        } else if (token) {
          console.warn("removeFromCart: Item only existed locally. No API call needed.");
        }
      },
      clearCart: async () => {
        const token = getAuthToken();
        set({ localCartItems: [] });
        get().setCart(null);
        if (!token) {
          return;
        }
        ecommerceService.clearCart()
          .then(() => get().fetchCart())
          .catch((err: any) => {
            console.error("Failed to clear cart:", err);
            get().set({ error: err.message || "Failed to clear cart" });
          });
      },
      syncLocalCartToServer: async () => {
        const token = getAuthToken();
        const { localCartItems } = get();         
        if (!token || !localCartItems.length) return;
            
        try {
          let updatedCart = await ecommerceService.getCart();
          const serverItemMap = new Map(
            (updatedCart?.items || []).map((item: any) => [
              item.product.id,
              item.id,
            ])
          );
        
          for (const item of localCartItems) {
            if (!serverItemMap.has(item.productId)) {
              const data: AddToCartRequest = {
                product_id: item.productId,
                quantity: item.quantity,
              };
              updatedCart = await ecommerceService.addToCart(data);
            }
          }
          get().setCart(updatedCart || null);
          set({ localCartItems: [] });
        } catch (err: any) {
          console.error("Failed to sync local cart:", err);
          set({ error: err.message || "Failed to sync cart" });
        }
      },
    }),
    {
      name: "ecommerce-store",
      partialize: (state) => ({
        localCartItems: state.localCartItems,
      }),
    }
  )
);

export const useProducts = () => {
  const products = useEcommerceStore((state) => state.products);
  const filteredProducts = useEcommerceStore((state) => state.filteredProducts);
  const categories = useEcommerceStore((state) => state.categories);
  const searchQuery = useEcommerceStore((state) => state.searchQuery);
  const selectedCategory = useEcommerceStore((state) => state.selectedCategory);
  const loading = useEcommerceStore((state) => state.loading);
  const error = useEcommerceStore((state) => state.error);
  return {
    products,
    filteredProducts,
    categories,
    searchQuery,
    selectedCategory,
    loading,
    error,
  };
};

export const useCart = () => {
  const cart = useEcommerceStore((state) => state.cart);
  const itemCount = useEcommerceStore((state) => state.itemCount);
  const totalAmount = useEcommerceStore((state) => state.totalAmount);
  const loading = useEcommerceStore((state) => state.cartLoading);
  const error = useEcommerceStore((state) => state.error);
  return { cart, itemCount, totalAmount, loading, error };
};

export const useCartActions = () => {
  const addToCart = useEcommerceStore((state) => state.addToCart);
  const updateCartItem = useEcommerceStore((state) => state.updateCartItem);
  const removeFromCart = useEcommerceStore((state) => state.removeFromCart);
  const clearCart = useEcommerceStore((state) => state.clearCart);
  const setCart = useEcommerceStore((state) => state.setCart);
  const fetchCart = useEcommerceStore((state) => state.fetchCart);
  const syncLocalCartToServer = useEcommerceStore(
    (state) => state.syncLocalCartToServer
  );
  return {
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    setCart,
    fetchCart,
    syncLocalCartToServer,
  };
};

export const useProductActions = () => {
  const setSearchQuery = useEcommerceStore((state) => state.setSearchQuery);
  const setSelectedCategory = useEcommerceStore(
    (state) => state.setSelectedCategory,
  );
  const fetchCategories = useEcommerceStore((state) => state.fetchCategories);
  const fetchProducts = useEcommerceStore((state) => state.fetchProducts);
  const setLoading = useEcommerceStore((state) => state.setLoading);
  const setError = useEcommerceStore((state) => state.setError);
  return {
    setSearchQuery,
    setSelectedCategory,
    fetchCategories,
    fetchProducts,
    setLoading,
    setError,
  };
};
