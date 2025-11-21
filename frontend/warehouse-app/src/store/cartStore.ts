import { create } from "zustand";
import { persist } from "zustand/middleware";

import { ecommerceService } from "@/services/ecommerce.service";
import { getAuthToken } from "./ecommerceStore";
import { CartStore } from "./storeTypes";
import { EcommerceProduct, LocalCartItem } from "@/types/ecommerce";

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartProducts: [],
      checkoutProducts: [],
      loading: false,

      setLoading: (value: boolean) => set({ loading: value }),

      toggleCartItemSelection: (productIds: string | string[]) => {
        const state = get();
        const selected = new Set(state.checkoutProducts);
        const ids = Array.isArray(productIds) ? productIds : [productIds];

        ids.forEach((id) => {
          if (selected.has(id)) selected.delete(id);
          else selected.add(id);
        });

        set({ checkoutProducts: [...selected] });
      },

      // LEARN: clearing products in checkout section after successful payment
      clearCheckoutProducts: () => set({ checkoutProducts: [] }),

      // LEARN: one product has multiple quantity s we're counting
      // e.g. 1 product has 2 pieces (quantity) and other product has 1 piece (quantity) = 3 pieces
      cartProductQuantityCount: () =>
        get().cartProducts.reduce((sum, item) => sum + item.quantity, 0),

      getItemQuantity: (productId: string) => {
        const item = get().cartProducts.find((item) => item.product_id === productId);
        return item?.quantity || 0;
      },

      getCart: async (country?: string) => {
        const token = getAuthToken();
        const state = get();

        if (state.cartProducts.length > 0) {
          if (token) {
             state.syncCart(country).catch(console.error);
          }

          const needsPopulation = state.cartProducts.some(i => !i.product);
          
          if (needsPopulation) {
            try {
              const itemsWithProducts = await Promise.all(
                state.cartProducts.map(async (item) => {
                  if (item.product) return item;
                  const product = await ecommerceService.getProduct(item.product_id!, country);
                  return { ...item, product };
                })
              );
              set({ cartProducts: itemsWithProducts });
            } catch (error) {
              console.error("Failed to populate cart products:", error);
            }
          }
          return state.cartProducts;
        }

        if (!token) return state.cartProducts;

        set({ loading: true });
        try {
          const serverCart: any = await ecommerceService.getCart(country);
          const serverItems = serverCart.items ?? [];
          set({ cartProducts: serverItems });
          return serverItems;
        } catch (error) {
          console.error("Failed to fetch cart:", error);
          return [];
        } finally {
          set({ loading: false });
        }
      },

      syncCart: async (country?: string) => {
        const token = getAuthToken();
        if (!token) return;

        const serverCart: any = await ecommerceService.getCart(country);
        const serverItems: LocalCartItem[] = serverCart.items ?? [];
        const localCart = get().cartProducts;

        const toAdd = localCart.filter((local: LocalCartItem) =>
          !serverItems.some((server: LocalCartItem) => server.product_id === local.product_id)
        );

        const toRemove = serverItems.filter((server: LocalCartItem) =>
          !localCart.some((local: LocalCartItem) => local.product_id === server.product_id)
        );
        
        const toUpdate = localCart.filter((local) => {
           const serverItem = serverItems.find(s => s.product_id === local.product_id);
           return serverItem && serverItem.quantity !== local.quantity;
        });

        await Promise.all([
          ...toAdd.map((item) =>
            ecommerceService.addToCart(
              { product_id: item.product_id!, quantity: item.quantity },
              country
            )
          ),
          ...toUpdate.map((item) => 
             ecommerceService.addToCart(
               { product_id: item.product_id!, quantity: item.quantity }, 
               country
             )
          ),
          ...toRemove.map((item) =>
            ecommerceService.removeFromCart(item.product_id!, country)
          ),
        ]);
      },

      addProductToCart: async (
        productOrId: string | EcommerceProduct,
        quantity: number,
        country?: string
      ) => {
        const token = getAuthToken();
        const state = get();

        const isProductObject = typeof productOrId !== 'string';
        const product_id = isProductObject ? productOrId.id : productOrId;
        const productData = isProductObject ? productOrId : undefined;

        const updatedCart = [...state.cartProducts];
        const existing = updatedCart.find(
          (item: LocalCartItem) => item.product_id === product_id
        );

        if (existing) {
          existing.quantity += quantity;

          if (productData) {
            existing.product = productData;
          }

          if (existing.quantity <= 0) {
            const index = updatedCart.indexOf(existing);
            updatedCart.splice(index, 1);
            set({ cartProducts: updatedCart });

            if (token) {
              ecommerceService
                .removeFromCart(product_id, country)
                .catch(() => get().syncCart(country));
            }
            return;
          }
        } else {
          if (quantity > 0) {
            updatedCart.push({
              product_id,
              quantity,
              country,
              product: productData
            } as LocalCartItem);
          }
        }

        set({ cartProducts: updatedCart });

        if (!token) return;

        if (quantity > 0) {
          ecommerceService
            .addToCart({ product_id, quantity }, country)
            .catch(() => get().syncCart(country));
        } else {
          ecommerceService
            .removeFromCart(product_id, country)
            .catch(() => get().syncCart(country));
        }
      },

      removeProductFromCart: async (product_id: string, country?: string) => {
        const token = getAuthToken();

        const updatedCart = get().cartProducts.filter(
          (item: LocalCartItem) => item.product_id !== product_id
        );

        set({ cartProducts: updatedCart });

        if (!token) return;

        ecommerceService
          .removeFromCart(product_id, country)
          .catch(() => get().syncCart(country));
      },
    }),
    {
      name: "cart-storage",
    }
  )
);