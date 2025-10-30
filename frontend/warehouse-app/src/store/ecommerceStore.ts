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
  fetchProducts: () => Promise<void>;
}

// Cart Store State
interface CartState {
  cart: Cart | null;
  localCartItems: LocalCartItem[];
  itemCount: number;
  totalAmount: number;
  loading: boolean;
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
  products: EcommerceProduct[]
): Cart | null => {
  if (!localItems.length) return null;

  const items = localItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return null;

      const unitPrice = product.price;
      const totalPrice = unitPrice * item.quantity;

      return {
        id: `local-${product.id}`,
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
    id: "local-cart-id",
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
      loading: false,
      error: null,

      // Cart State
      cart: null,
      localCartItems: [],
      itemCount: 0,
      totalAmount: 0,

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
        set({ loading: true, error: null });
        try {
          const categories = await ecommerceService.getCategories();
          set({ categories, loading: false });
        } catch (err: any) {
          console.error("Failed to fetch categories:", err);
          set({
            error: err.message || "Failed to fetch categories",
            loading: false,
          });
        }
      },
      fetchProducts: async () => {
        set({ loading: true, error: null });
        try {
          const products = await ecommerceService.getProducts();
          set({ products, filteredProducts: products, loading: false });
          const token = getAuthToken();
          if (!token) {
            const state = get();
            if (state.localCartItems.length > 0) {
              const computed = computeCartFromLocal(
                state.localCartItems,
                products
              );
              state.setCart(computed);
            }
          }
        } catch (err: any) {
          console.error("Failed to fetch products:", err);
          set({
            error: err.message || "Failed to fetch products",
            loading: false,
          });
        }
      },

      // Cart Actions
      setCart: (cart) => {
        if (!cart || !cart.items) {
          set({
            cart: null,
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
        set({ loading: true, error: null });
        if (!token) {
          const { localCartItems, products } = get();
          const computed = computeCartFromLocal(localCartItems, products);
          get().setCart(computed);
          set({ loading: false });
          return;
        }
        try {
          const cart = await ecommerceService.getCart();
          get().setCart(cart);
          set({ loading: false });
        } catch (err: any) {
          console.error("Failed to fetch cart:", err);
          if (err.response && err.response.status === 404) {
            get().setCart(null);
            set({ loading: false, error: null });
          } else {
            set({
              error: err.message || "Failed to fetch cart",
              loading: false,
            });
          }
        }
      },
      addToCart: async (productId: string, quantity = 1) => {
        const token = getAuthToken();
        set({ loading: true, error: null });
        if (!token) {
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
              state.products
            );
            get().setCart(computed);
            return { localCartItems: updatedLocalItems };
          });
          set({ loading: false });
          return;
        }
        try {
          const data: AddToCartRequest = { product_id: productId, quantity };
          const updatedCart = await ecommerceService.addToCart(data);
          get().setCart(updatedCart);
          set({ loading: false });
        } catch (err: any) {
          console.error("Failed to add to cart:", err);
          set({
            error: err.message || "Failed to add to cart",
            loading: false,
          });
        }
      },
      updateCartItem: async (itemId: string, quantity: number) => {
        const token = getAuthToken();
        if (!token) {
          if (quantity <= 0) {
            get().removeFromCart(itemId);
            return;
          }
          set((state) => {
            const productId = itemId.replace("local-", "");
            const index = state.localCartItems.findIndex(
              (i) => i.productId === productId
            );
            if (index === -1) return state;
            const updated = [...state.localCartItems];
            updated[index].quantity = quantity;
            const computed = computeCartFromLocal(updated, state.products);
            get().setCart(computed);
            return { localCartItems: updated };
          });
          return;
        }
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }
        set({ loading: true, error: null });
        try {
          const data: UpdateCartItemRequest = { quantity };
          const updatedCart = await ecommerceService.updateCartItem(itemId, data);
          get().setCart(updatedCart);
          set({ loading: false });
        } catch (err: any) {
          console.error("Failed to update cart item:", err);
          set({
            error: err.message || "Failed to update cart item",
            loading: false,
          });
        }
      },
      removeFromCart: async (itemId: string) => {
        const token = getAuthToken();
        if (!token) {
          set((state) => {
            const productId = itemId.replace("local-", "");
            const updated = state.localCartItems.filter(
              (i) => i.productId !== productId
            );
            const computed = computeCartFromLocal(updated, state.products);
            get().setCart(computed);
            return { localCartItems: updated };
          });
          return;
        }
        set({ loading: true, error: null });
        try {
          const updatedCart = await ecommerceService.removeFromCart(itemId);
          get().setCart(updatedCart);
          set({ loading: false });
        } catch (err: any) {
          console.error("Failed to remove item from cart:", err);
          set({
            error: err.message || "Failed to remove item from cart",
            loading: false,
          });
        }
      },
      clearCart: async () => {
        const token = getAuthToken();
        set({ loading: true, error: null });
        if (!token) {
          set({ localCartItems: [] });
          get().setCart(null);
          set({ loading: false });
          return;
        }
        try {
          await ecommerceService.clearCart();
          get().setCart(null);
          set({ loading: false });
        } catch (err: any) {
          console.error("Failed to clear cart:", err);
          set({
            error: err.message || "Failed to clear cart",
            loading: false,
          });
        }
      },
      syncLocalCartToServer: async () => {
        const token = getAuthToken();
        if (!token) return;
        const { localCartItems } = get();
        if (!localCartItems.length) return;
        set({ loading: true, error: null });
        try {
          let updatedCart: Cart | null = null;
          for (const item of localCartItems) {
            const data: AddToCartRequest = {
              product_id: item.productId,
              quantity: item.quantity,
            };
            updatedCart = await ecommerceService.addToCart(data);
          }
          if (updatedCart) {
            get().setCart(updatedCart);
          }
          set({ localCartItems: [] });
          set({ loading: false });
        } catch (err: any) {
          console.error("Failed to sync local cart:", err);
          set({
            error: err.message || "Failed to sync cart",
            loading: false,
          });
        }
      },
    }),
    {
      name: "ecommerce-store",
      partialize: (state) => ({
        cart: state.cart,
        localCartItems: state.localCartItems,
        itemCount: state.itemCount,
        totalAmount: state.totalAmount,
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
  const loading = useEcommerceStore((state) => state.loading);
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
