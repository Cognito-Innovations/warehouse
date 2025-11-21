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
import { getCartItemPricingSummary } from "@/utils/priceUtils";

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
  productsCount: number;
  hasMoreProducts: boolean;
  loadingNextPage: boolean;
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
  fetchProductsPage: (country?: string, offset?: number, limit?: number, append?: boolean, searchTerm?: string) => Promise<void>;
  resetProducts: () => void;
  fetchMoreProducts: (country?: string, searchTerm?: string) => Promise<void>;
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
  fetchCart: (country?: string) => Promise<void>;
  addToCart: (productId: string, quantity?: number, country?: string) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number, country?: string) => Promise<void>;
  removeFromCart: (itemId: string, country?: string) => Promise<void>;
  clearCart: (country?: string) => Promise<void>;
  syncLocalCartToServer: (country?: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

// Combined Store
interface EcommerceStore
  extends ProductState,
    ProductActions,
    CartState,
    CartActions {}

interface NormalizedCartState {
  cart: Cart | null;
  itemCount: number;
  subtotal: number;
  discountTotal: number;
}

const normalizeCartState = (
  cart: Cart | null,
  products: EcommerceProduct[]
): NormalizedCartState => {
  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return {
      cart: cart ? { ...cart, items: cart.items || [] } : cart,
      itemCount: 0,
      subtotal: 0,
      discountTotal: 0,
    };
  }

  let discountTotal = 0;
  let itemCount = 0;

  const normalizedItems = cart.items.map((item) => {
    const canonicalProduct =
      products.find((p) => p.id === item.product.id) || item.product;
    const enrichedItem = { ...item, product: canonicalProduct };
    const pricing = getCartItemPricingSummary(enrichedItem);

    discountTotal += pricing.discountTotal;
    itemCount += enrichedItem.quantity || 0;

    return {
      ...enrichedItem,
      unit_price: pricing.discountedUnitPrice,
      total_price: pricing.lineTotal,
      discount_percentage: pricing.discountPercent,
    };
  });

  const subtotal = normalizedItems.reduce(
    (sum, item) => sum + (Number(item.total_price) || 0),
    0
  );

  const normalizedCart: Cart = {
    ...cart,
    items: normalizedItems,
    total_amount: subtotal,
    discount_percentage: discountTotal,
    final_amount: subtotal,
  };

  return {
    cart: normalizedCart,
    itemCount,
    subtotal,
    discountTotal,
  };
};

const computeCartFromLocal = (
  localItems: LocalCartItem[],
  products: EcommerceProduct[],
  existingCart: Cart | null
): Cart | null => {
  if (!localItems.length) return null;

  const items = localItems
    .map((item) => {
      const existingItem = existingCart?.items.find(
        (i) => i.product.id === item.productId && !i.id.startsWith("local-")
      );

      let product = products.find((p) => p.id === item.productId);
      if (!product && existingItem) {
        product = existingItem.product;
      }
      if (!product) return null;

      const id = existingItem ? existingItem.id : `local-${product.id}`;

      return {
        id,
        product,
        quantity: item.quantity,
        unit_price: existingItem?.unit_price ?? 0,
        total_price: existingItem?.total_price ?? 0,
        discount_percentage: Number(existingItem?.discount_percentage ?? product.discount_percentage) || 0,
        created_at: existingItem?.created_at || new Date().toISOString(),
        updated_at: existingItem?.updated_at || new Date().toISOString(),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (!items.length) return null;

  const baseCart: Cart = {
    id: existingCart?.id || "local-cart-id",
    items,
    total_amount: existingCart?.total_amount || 0,
    discount_percentage: existingCart?.discount_percentage || 0,
    final_amount: existingCart?.final_amount || 0,
    user_id: existingCart?.user_id || "",
    status: existingCart?.status || "ACTIVE",
    created_at: existingCart?.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return normalizeCartState(baseCart, products).cart;
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
      loading: false,
      error: null,
      productsCount: 0,
      hasMoreProducts: true,
      loadingNextPage: false,

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
      fetchProductsPage: async (country, offset = 0, limit = 20, append = false, searchTerm) => {
        set({ loadingNextPage: true });
        try {
          const products = await ecommerceService.getProducts(searchTerm, country, limit, offset);
          const current = get().products;
          const mergedProducts = append ? [...current, ...products] : products;
          set({
            products: mergedProducts,
            filteredProducts: mergedProducts,
            hasMoreProducts: products.length === limit,
            productsCount: append ? (current.length + products.length) : products.length,
          });
          const localCartItems = get().localCartItems;
          if (localCartItems && localCartItems.length > 0) {
            const cart = computeCartFromLocal(localCartItems, mergedProducts, get().cart);
            get().setCart(cart);
          }

          const existingCart = get().cart;
          if (existingCart && existingCart.items && existingCart.items.length > 0) {
            get().setCart({
              ...existingCart,
              items: [...existingCart.items],
            });
          }
        } catch (err: any) {
          set({ error: err.message || "Failed to fetch products" });
        } finally {
          set({ loadingNextPage: false });
        }
      },
      fetchProducts: async (country, searchTerm) => {
        await get().fetchProductsPage(country, 0, 20, false, searchTerm);
      },
      fetchMoreProducts: async (country, searchTerm) => {
        const current = get().products;
        await get().fetchProductsPage(country, current.length, 20, true, searchTerm);
      },
      resetProducts: () => {
        set({ products: [], filteredProducts: [], productsCount: 0, hasMoreProducts: true });
      },

      // Cart Actions
      setCart: (cart) => {
        if (cart && !cart.items) {
          cart.items = [];
        }
        const products = get().products;
        if (!cart || !cart.items || cart.items.length === 0) {
          set({
            cart: cart ? { ...cart, items: cart.items || [] } : cart,
            itemCount: 0,
            totalAmount: 0,
          });
          return;
        }
        const { cart: normalizedCart, itemCount, subtotal } = normalizeCartState(
          cart,
          products
        );
        set({
          cart: normalizedCart,
          itemCount,
          totalAmount: subtotal,
        });
      },
      fetchCart: async (country) => {
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
          const serverCart = await ecommerceService.getCart(country);
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
      addToCart: async (productId: string, quantity = 1, country) => {
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
          const updatedCart = await ecommerceService.addToCart(data, country);
          get().setCart(updatedCart);
          if (updatedCart && Array.isArray(updatedCart.items)) {
            const localItems = get().localCartItems;
            const localMap = new Map(localItems.map((item) => [item.productId, item.quantity]));
            const serverMap = new Map(
              updatedCart.items.map((item: any) => [item.product.id, item.quantity])
            );
            const allproductIds = new Set([
              ...localMap.keys(),
              ...Array.from(serverMap.keys()),
            ]);

            const mergedLocalItems: LocalCartItem[] = [];
            for (const productId of allproductIds) {
              const localQty = localMap.get(productId);
              if (localQty !== undefined) {
                mergedLocalItems.push({ productId, quantity: localQty });
              } else {
                const serverQty = serverMap.get(productId);
                if (serverQty !== undefined) {
                  mergedLocalItems.push({ productId, quantity: serverQty });
                }
              }
            }
            set({ localCartItems: mergedLocalItems });
            const mergedCart = computeCartFromLocal(mergedLocalItems, get().products, updatedCart);
            get().setCart(mergedCart);
          } else {
            get().setCart(updatedCart);
          }
        } catch (err: any) {
          console.error("Failed to add to cart:", err);
          get().set({ error: err.message || "Failed to add to cart" });
          get().fetchCart(country);
        }
      },
      updateCartItem: async (itemId: string, quantity: number, country) => {
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
            ecommerceService.removeFromCart(serverIdForApi, country)
              .then(() => get().fetchCart(country))
              .catch((err: any) => {
                console.error("Failed to remove from cart:", err);
                get().set({ error: err.message || "Failed to remove from cart" });
                get().fetchCart(country);
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
                await ecommerceService.updateCartItem(finalServerId, data, country);
              } catch (err: any) {
                console.error("Failed to update cart item:", err);
                get().set({ error: err.message || "Failed to update cart item" });
              }
            } else {
              const data: AddToCartRequest = { product_id: productId, quantity: finalQuantity, country };
              try {
                await ecommerceService.addToCart(data);
              } catch (err: any) {
                console.error("Failed to add new item via update:", err);
                get().set({ error: err.message || "Failed to add item" });
              }
            }
          }, 500);
        }
      },
      removeFromCart: async (itemId: string, country) => {
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
        const oldLocalCartItems = get().localCartItems;
        const oldCart = get().cart;
        const updatedLocalCartItems = oldLocalCartItems.filter(
          (i) => i.productId !== productId
        );
        const computedCart = computeCartFromLocal(updatedLocalCartItems, products, oldCart);
        get().setCart(computedCart);
        set({ localCartItems: updatedLocalCartItems });
        if (token && serverIdForApi) {
          ecommerceService.removeFromCart(serverIdForApi, country)
            .catch((err: any) => {
              if (err.response?.status === 404) {
                console.warn("Item not found on server (may already be deleted)");
              } else {
                console.error("Failed to remove item from cart:", err);
                get().set({ error: err.message || "Failed to remove item from cart" });
                set({ localCartItems: oldLocalCartItems });
                const revertedCart = computeCartFromLocal(oldLocalCartItems, products, oldCart);
                get().setCart(revertedCart);
              }
            });
        } else if (token) {
          console.warn("removeFromCart: Item only existed locally. No API call needed.");
        }
      },
      clearCart: async (country) => {
        const token = getAuthToken();
        set({ localCartItems: [] });
        get().setCart(null);
        if (!token) {
          return;
        }
        ecommerceService.clearCart()
          .then(() => get().fetchCart(country))
          .catch((err: any) => {
            console.error("Failed to clear cart:", err);
            get().set({ error: err.message || "Failed to clear cart" });
          });
      },
      syncLocalCartToServer: async (country) => {
        const token = getAuthToken();
        const { localCartItems } = get();         
        if (!token || !localCartItems.length) return;
            
        try {
          let updatedCart = await ecommerceService.getCart(country);
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
                country
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
  const productsCount = useEcommerceStore((state) => state.productsCount);
  const hasMoreProducts = useEcommerceStore((state) => state.hasMoreProducts);
  const loadingNextPage = useEcommerceStore((state) => state.loadingNextPage);
  return {
    products,
    filteredProducts,
    categories,
    searchQuery,
    selectedCategory,
    loading,
    error,
    productsCount,
    hasMoreProducts,
    loadingNextPage,
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
  const fetchMoreProducts = useEcommerceStore((state) => state.fetchMoreProducts);
  const resetProducts = useEcommerceStore((state) => state.resetProducts);
  return {
    setSearchQuery,
    setSelectedCategory,
    fetchCategories,
    fetchProducts,
    setLoading,
    setError,
    fetchMoreProducts,
    resetProducts,
  };
};
