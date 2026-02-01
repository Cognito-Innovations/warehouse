import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ecommerceService } from "@/services/ecommerce.service";
import { CartStore } from "./storeTypes";
import { CartItem } from "@/types/ecommerce";

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      userId: null,
      isLoading: false,
      _hasHydrated: false,

      setHasHydrated: (value: boolean) => {
        set({ _hasHydrated: value });
      },

      setUserId: (userId: string | null) => {
        set({ userId });
      },

      getCart: async () => {
        const cart = await ecommerceService.fetchCart();
        set({ cart: cart?.items || [] });
      },

      removeProductFromCart: async (productId: string) => {
        const {cart, userId} = get();
        const existingCartProduct = cart.find((item: any) => item.product_id === productId)
        if(existingCartProduct?.quantity && existingCartProduct.quantity > 1) {
          set({
            cart: cart.map((item: any) =>
              item.product_id === productId
                ? { ...item, quantity: (item.quantity || 0) - 1 }
                : item
            ),
          });
        } else {
          set({ cart: cart.filter((item: any) => item.product_id !== productId) });
        }
        if(userId) await ecommerceService.removeFromCart(productId);
      },

      addProductToCartStore: async (productId: string, requestedQty: number) => {
        const {cart} = get();
        const existingCartProduct = cart.find((item: CartItem) => item.product_id === productId)
        if(existingCartProduct) {
          set({
            cart: cart.map((item: any) =>
              item.product_id === productId
                ? { ...item, quantity: item.quantity + requestedQty }
                : item
            ),
          });
        }
        else {
          set({ cart: [...cart, { product_id: productId, quantity: requestedQty }] });
        }
      },

      addProductToCart: (productId: string, requestedQty: number, productStockQty: number): any => {
        const {userId, addProductToCartStore} = get();
        if (!productId || requestedQty > productStockQty) return;
        set({ isLoading: true });
        if(userId) ecommerceService.addToCart({ product_id: productId, quantity: requestedQty });
        addProductToCartStore(productId, requestedQty);
        set({ isLoading: false });
      },

      syncLocalStorageProductsToCartDB: async (userId: string) => {
        try {
          const { cart } = get();
          set({ userId });
          set({ isLoading: true });
          if(userId && cart.length) {
            const cartData = await ecommerceService.syncLocalStorageProductsToCart(cart);
            set({ cart: cartData });
            useCartStore.persist.clearStorage();
          }
        } catch (error) {
          console.error('Error syncing local storage products to cart DB:', error);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "cart-storage",
      version: 2,
      partialize: (state) => ( state.userId ? {} : { cart: state.cart }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export const useCartHasHydrated = () => useCartStore((state) => state._hasHydrated);