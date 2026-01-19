import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

import { ecommerceService } from "@/services/ecommerce.service";
import { getAuthToken } from "@/utils/getAuthToken";
import { CartStore } from "./storeTypes";
import { EcommerceProduct, LocalCartItem, DeliveryOption } from "@/types/ecommerce";

const getCargoLabel = (product?: EcommerceProduct) =>
  product?.cargo_option?.label?.toLowerCase() ?? null;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartProducts: [],
      updatingProducts: {},
      checkoutProducts: [],
      selectedDeliveryOption: null,
      loading: false,
      isSyncing: false,
      _hasHydrated: false,
      hasUnsyncedChanges: false,
      setHasHydrated: (value: boolean) => set({ _hasHydrated: value }),
      setSelectedDeliveryOption: (option: DeliveryOption | null) => set({ selectedDeliveryOption: option }),

      setLoading: (value: boolean) => set({ loading: value }),

      setUpdating: (productId: string, isUpdating: boolean) => 
        set((state) => ({
          updatingProducts: {
            ...state.updatingProducts,
            [productId]: isUpdating,
          },
        })),

      setCheckoutProducts: (productIds: string[]) => {
        set({ checkoutProducts: productIds });
      },

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

      setCartProducts: (products: any[]) => set({ cartProducts: products }),

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

      getServerCartItemId: async (productId: string, currency?: string, countryCode?: string) => {
        const token = getAuthToken();
        if (!token) return undefined;

        try {
          const serverCart: any = await ecommerceService.getCart(currency, countryCode);
          const serverItem = (serverCart.items ?? []).find((i: any) => i.product_id === productId);
          return serverItem?.id || undefined;
        } catch (error) {
          console.error("Failed to get line id:", error);
          return undefined;
        }
      },

      refreshCart: async (currency?: string, countryCode?: string) => {
        const token = getAuthToken();
        if (!token) return get().cartProducts;

        try {
          const serverCart: any = await ecommerceService.getCart(currency, countryCode);
          const serverItems = serverCart.items ?? [];
          const currentState = get();
          const mergedItems = serverItems.map((serverItem: any) => {
            const localItem = currentState.cartProducts.find(
              (l: LocalCartItem) => l.product_id === serverItem.product_id
            );
            return {
              ...serverItem,
              ...(localItem && !serverItem.product ? { product: localItem.product } : {}),
            };
          });

          const cargos = new Set(
            mergedItems
              .map(item => getCargoLabel(item.product))
              .filter(Boolean)
          );
          
          if (cargos.size > 1) {
            const [firstCargo] = cargos;
            const cleaned = mergedItems.filter(
              item => getCargoLabel(item.product) === firstCargo
            );
            set({ cartProducts: cleaned, hasUnsyncedChanges: true });
            return cleaned;
          }

          set({ cartProducts: mergedItems as LocalCartItem[], hasUnsyncedChanges: false });       
          return mergedItems as LocalCartItem[];
        } catch (error) {
          console.error("Failed to refresh cart:", error);
          return get().cartProducts;
        }
      },

      getCart: async (currency?: string, countryCode?: string) => {
        const token = getAuthToken();
        const state = get();

        if (token) {
          try {
            const hasLocalItemsToSync = state.cartProducts.length > 0;

            if (hasLocalItemsToSync && state.hasUnsyncedChanges) {
              await state.syncCart(currency, countryCode);
            } else {
              await state.refreshCart(currency, countryCode);
            }

            return get().cartProducts;

          } catch (error) {
            console.error("Failed to fetch/sync cart:", error);
            try {
              await state.refreshCart(currency, countryCode);
              return get().cartProducts;
            } catch (innerError) {
              console.error("Fallback failed:", innerError);
              return state.cartProducts;
            }
          }
        }

        if (state.cartProducts.length > 0) {
          const needsPopulation = state.cartProducts.some((i) => !i.product);
          
          if (needsPopulation) {
            try {
              const itemsWithProducts = await Promise.all(
                state.cartProducts.map(async (item) => {
                  if (item.product) return item;
                  if (!item.product_id) return item; 

                  const product = await ecommerceService.getProduct(
                    item.product_id,
                    currency
                  );
                  return { ...item, product };
                })
              );
              set({ cartProducts: itemsWithProducts });
            } catch (error) {
              console.error("Failed to populate cart products:", error);
            }
          }
          return get().cartProducts;
        }

        return [];
      },

      syncCart: async (currency?: string, countryCode?: string) => {
        const token = getAuthToken();
        if (!token) return;
        
        set({ isSyncing: true });

        try {
          const serverCart: any = await ecommerceService.getCart(currency, countryCode);
          const serverItems: LocalCartItem[] = serverCart.items ?? [];
          const localCart = get().cartProducts;

          const cargos = new Set(
            localCart.map(item => getCargoLabel(item.product)).filter(Boolean)
          );

          if (cargos.size > 1) {
            console.warn("Mixed cargo detected locally during sync. Aborting sync.");
            set({ isSyncing: false });
            return;
          }

          const toAdd = localCart.filter((local: LocalCartItem) =>
            !serverItems.some((server: LocalCartItem) => server.product_id === local.product_id)
          );

          const toUpdate = localCart.filter((local) => {
            const serverItem = serverItems.find(s => s.product_id === local.product_id);
            return serverItem && serverItem.quantity !== local.quantity;
          });

          const toRemove = serverItems.filter((serverItem: any) => 
            !localCart.some((localItem: LocalCartItem) => localItem.product_id === serverItem.product_id)
          );
          
          if (toAdd.length === 0 && toUpdate.length === 0 && toRemove.length === 0) {
            const currentState = get();
            const mergedItems = serverItems.map((serverItem: any) => {
              const localItem = currentState.cartProducts.find(
                (l: LocalCartItem) => l.product_id === serverItem.product_id
              );
              return {
                ...serverItem,
                ...(localItem && !serverItem.product ? { product: localItem.product } : {}),
              };
            });
            set({ cartProducts: mergedItems as LocalCartItem[], hasUnsyncedChanges: false });
            return; 
          }

          if (toAdd.length > 0) {
            await Promise.allSettled(toAdd.map(async (item) => {
              if (item.product_id) {
                try {
                  await ecommerceService.addToCart({ product_id: item.product_id, quantity: item.quantity }, currency, countryCode);
                } catch (e) {
                  console.warn(`Failed to sync add item ${item.product_id}`, e);
                }
              }
            }));
          }

          if (toUpdate.length > 0) {
            await Promise.allSettled(toUpdate.map(async (item) => {
              if (item.product_id) {
                let lineId: string;
                if (item.id) {
                  lineId = item.id;
                } else {
                  const fetchedId = await get().getServerCartItemId(item.product_id, currency, countryCode);
                  if (!fetchedId) {
                    console.warn(`Skipping sync update for ${item.product_id}: no line ID found`);
                    return;
                  }
                  lineId = fetchedId;
                }
                try {
                  await ecommerceService.updateCartItem(
                    lineId, 
                    { quantity: item.quantity }, 
                    currency,
                    countryCode
                  );
                } catch (e) {
                  console.warn(`Failed to sync update item ${item.product_id}`, e);
                }
              }
            }));
          }

          if (toRemove.length > 0) {
            await Promise.allSettled(toRemove.map(async (item: any) => {
              if (item.id) {
                try {
                  await ecommerceService.removeFromCart(item.id, currency, countryCode);
                } catch (e) {
                  console.warn(`Failed to sync remove item ${item.product_id}`, e);
                }
              }
            }));
          }

          await get().refreshCart(currency, countryCode);
        } catch (error) {
          console.error("Sync Cart General Error:", error);
          await get().refreshCart(currency, countryCode);
        } finally {
          set({ isSyncing: false });
        }
      },

      //TODO P0: We need to break this API into 4-5 parts
      // addProduct fn with quantity -> does 2 jobs -> takes Id & quantity -> pass to api -> this api checks if product created then update quanity else create product with 1 quanity and whole update in db and if fail show reject message then add whole data to cart
      // same for removeProduct fn with quanity
      addOrIncreaseQty: async (
        product: EcommerceProduct,
        quantity: number,
        currency?: string,
        countryCode?: string,
      ) => {
        // Add or Increase the quantity of product to cart
        if (quantity <= 0) {
          console.warn("Invalid quantity, unable perform add to cart");
          return;
        }

        const token = getAuthToken();
        const state = get();

        const product_id = product?.id;

        if (!product_id) {
          console.warn("Product doesnt have id, unable perform on add to cart");
          return;
        }

        let didClearCart = false; 

        const incomingCargo = getCargoLabel(product);

        if (incomingCargo) {
          const filteredCart = state.cartProducts.filter((item) => {
            const existingCargo = getCargoLabel(item.product);

            return (
              !existingCargo ||
              existingCargo === incomingCargo
            );
          });

          if (filteredCart.length !== state.cartProducts.length) {
            set({
              cartProducts: filteredCart,
              hasUnsyncedChanges: false,
              selectedDeliveryOption: null,
              checkoutProducts: [],
            });
          
            if (token) {
              await ecommerceService.clearCart();
              didClearCart = true;
            }
          }
        }

        const latestState = get();
        const updatedCart = [...latestState.cartProducts];
        const existingIndex = updatedCart.findIndex(
          (item: LocalCartItem) => item.product_id === product_id
        );
        let oldItem: LocalCartItem | undefined;
        let isUpdateOperation = false;

        if (existingIndex !== -1) {
          oldItem = { ...updatedCart[existingIndex] };
          const existing = updatedCart[existingIndex];
          const newQuantity = existing.quantity + quantity;
          updatedCart[existingIndex] = { ...existing, quantity: newQuantity };
          if (product) updatedCart[existingIndex].product = product;
          isUpdateOperation = true;
        } else {
          const newItem: LocalCartItem = {
            product_id,
            quantity,
            currency,
            product
          };
          updatedCart.push(newItem);
        }

        set({ cartProducts: updatedCart, hasUnsyncedChanges: true });

        if (existingIndex === -1) {
          get().toggleCartItemSelection(product_id);
        }

        if (!token) return;

        get().setUpdating(product_id, true);

        try {
          if (isUpdateOperation && !didClearCart) {
            let lineId: string;
            if (oldItem?.id) {
              lineId = oldItem.id;
            } else {
              const fetchedLineId = await get().getServerCartItemId(product_id, currency, countryCode);
              if (!fetchedLineId) {
                set((s) => {
                  const cart = [...s.cartProducts];
                  const idx = cart.findIndex((i) => i.product_id === product_id);
                  if (idx !== -1 && oldItem) {
                    cart[idx] = oldItem;
                  }
                  return { cartProducts: cart };
                });
                toast.error("Failed to update cart quantity. Please try again.");
                return;
              }
              lineId = fetchedLineId;
            }
            await ecommerceService.updateCartItem(
              lineId, 
              { quantity: updatedCart[existingIndex].quantity }, 
              currency,
              countryCode
            );
          } else {
            await ecommerceService.addToCart(
              { product_id, quantity }, 
              currency,
              countryCode
            );
          }
        } catch (error) {
          console.error("Add/Update cart failed:", error);
          toast.error(
            isUpdateOperation 
              ? "Failed to update cart quantity. Please try again." 
              : "Failed to add to cart. Please try again."
          );
          if (isUpdateOperation) {
            set((s) => {
              const cart = [...s.cartProducts];
              const idx = cart.findIndex((i) => i.product_id === product_id);
              if (idx !== -1 && oldItem) {
                cart[idx] = oldItem;
              }
              return { cartProducts: cart };
            });
          } else {
            set((s) => ({ cartProducts: s.cartProducts.filter((i) => i.product_id !== product_id) }));
          }
          set({ hasUnsyncedChanges: false });
          return;
        } finally {
          get().setUpdating(product_id, false);
        }
      },

      decreaseProductQty: async (
        product: EcommerceProduct,
        quantity: number,
        currency?: string,
        countryCode?: string,
      ) => {
        // Decrease the quantity of the product from the cart
        if (quantity <= 0) return;
        
        const token = getAuthToken();
        const state = get();

        const product_id = product?.id;

        const existingIndex = state.cartProducts.findIndex(item => item.product_id === product_id);

        if (existingIndex === -1) return;

        const existing = state.cartProducts[existingIndex];
        const oldQuantity = existing.quantity;
        const newQuantity = oldQuantity - quantity;

        if (newQuantity <= 0) {
          await state.removeProductFromCart(product_id, currency, countryCode);
          return;
        }

        const updatedCart = [...state.cartProducts];
        updatedCart[existingIndex] = { ...existing, quantity: newQuantity }; 
        set({ cartProducts: updatedCart, hasUnsyncedChanges: true });

        if (!token) return;

        get().setUpdating(product_id, true);

        let lineId: string;
        if (existing.id) {
          lineId = existing.id;
        } else {
          const fetchedLineId = await get().getServerCartItemId(product_id, currency, countryCode);
          if (!fetchedLineId) {
            set((s) => {
              const cart = [...s.cartProducts];
              const idx = cart.findIndex((i) => i.product_id === product_id);
              if (idx !== -1) {
                cart[idx] = { ...existing, quantity: oldQuantity };
              }
              return { cartProducts: cart };
            });
            toast.error("Failed to update cart quantity. Please try again.");
            return;
          }
          lineId = fetchedLineId;
        }

        try {
           await ecommerceService.updateCartItem(
             lineId, 
             { quantity: newQuantity }, 
             currency,
             countryCode
           );
        } catch (error) {
          console.error("Decrease cart qty failed", error);
          toast.error("Failed to update cart quantity. Please try again.");
          set((s) => {
            const cart = [...s.cartProducts];
            const idx = cart.findIndex((i) => i.product_id === product_id);
            if (idx !== -1) {
              cart[idx] = { ...existing, quantity: oldQuantity };
            }
            return { cartProducts: cart };
          });
          set({ hasUnsyncedChanges: false });
          return;
        } finally {
          get().setUpdating(product_id, false);
        }
      },

      removeProductFromCart: async (product_id: string, currency?: string, countryCode?: string) => {
        // Completely remove product from the cart
        const token = getAuthToken();

        const state = get();
        const item = state.cartProducts.find((i: LocalCartItem) => i.product_id === product_id);
        if (!item) return;

        const updatedCart = state.cartProducts.filter(
          (i: LocalCartItem) => i.product_id !== product_id
        );

        set({ cartProducts: updatedCart, hasUnsyncedChanges: true });

        if (!token) return;

        get().setUpdating(product_id, true);

        let lineId: string;
        if (item.id) {
          lineId = item.id;
        } else {
          const fetchedLineId = await get().getServerCartItemId(product_id, currency, countryCode);
          if (!fetchedLineId) {
            set({ cartProducts: [...updatedCart, item], hasUnsyncedChanges: false });
            toast.error("Failed to remove item from cart. Please try again.");
            return;
          }
          lineId = fetchedLineId;
        }

        try {
          await ecommerceService.removeFromCart(lineId, currency, countryCode);
        } catch (error) {
          console.error("Failed to remove from server:", error);
          toast.error("Failed to remove item from cart. Please try again.");
          set({ cartProducts: [...updatedCart, item], hasUnsyncedChanges: false });
          return;
        } finally {
          get().setUpdating(product_id, false);
        }
      },

      incrementCartQuantity: async (product: EcommerceProduct, currency?: string, countryCode?: string) => {
        // Increments the quantity of a product in the cart by 1 but only if the current quantity is below the available stock
        const state = get();
        const currentQuantity = state.getItemQuantity(product.id);
        if (currentQuantity >= product.stock_quantity) {
          return;
        }
        await state.addOrIncreaseQty(product, 1, currency, countryCode);
      },

      decrementCartQuantity: async (product: EcommerceProduct, currency?: string, countryCode?: string) => {
        // Decrements the quantity of a product in the cart by 1 but only if the current quantity is greater than 0
        const state = get();
        const currentQuantity = state.getItemQuantity(product.id);
        if (currentQuantity <= 0) {
          return;
        }
        await state.decreaseProductQty(product, 1, currency, countryCode);
      },

      setCartItemQuantity: async (productId: string, quantity: number, currency?: string, countryCode?: string) => {
        // Sets the exact quantity for a specific product in the cart to the provided value
        // If the new quantity is <= 0 it removes the item entirely
        // If the item isn't found in the cart, it logs warning
        const state = get();
        if (quantity <= 0) {
          await state.removeProductFromCart(productId, currency, countryCode);
          return;
        }

        const existingIndex = state.cartProducts.findIndex((item: LocalCartItem) => item.product_id === productId);
        
        if (existingIndex === -1) return;

        const existing = state.cartProducts[existingIndex];
        const oldQuantity = existing.quantity;
        if (oldQuantity === quantity) return;

        const updatedCart = [...state.cartProducts];
        updatedCart[existingIndex] = { ...existing, quantity };
        set({ cartProducts: updatedCart, hasUnsyncedChanges: true });
        const token = getAuthToken();
        if (!token) return;
        get().setUpdating(productId, true);
        let lineId: string;
        if (existing.id) {
          lineId = existing.id;
        } else {
          const fetchedLineId = await get().getServerCartItemId(productId, currency, countryCode);
          if (!fetchedLineId) {
            set((s) => {
              const cart = [...s.cartProducts];
              const idx = cart.findIndex((i) => i.product_id === productId);
              if (idx !== -1) {
                cart[idx] = { ...existing, quantity: oldQuantity };
              }
              return { cartProducts: cart };
            });
            toast.error("Failed to update cart quantity. Please try again.");
            return;
          }
          lineId = fetchedLineId;
        }
        try {
          await ecommerceService.updateCartItem(
            lineId, 
            { quantity }, 
            currency,
            countryCode
          );
        } catch (error) {
          console.error("Failed to set cart quantity:", error);
          toast.error("Failed to update cart quantity. Please try again.");
          set((s) => {
            const cart = [...s.cartProducts];
            const idx = cart.findIndex((i) => i.product_id === productId);
            if (idx !== -1) {
              cart[idx] = { ...existing, quantity: oldQuantity };
            }
            return { cartProducts: cart };
          });
          set({ hasUnsyncedChanges: false });
          return;
        } finally {
          get().setUpdating(productId, false);
        }
      },

      removePurchasedProducts: (purchasedProductIds: string[]) => {
        const state = get();
        
        const remainingCartProducts = state.cartProducts.filter(
          (item) => !purchasedProductIds.includes(item.product_id!)
        );

        set({ 
          cartProducts: remainingCartProducts, 
          checkoutProducts: [],
          hasUnsyncedChanges: true
        });
        
        localStorage.removeItem("checkoutSelectedItems");
      },
    }),
    {
      name: "cart-storage",
      version: 2,
      partialize: (state) => ({
        cartProducts: state.cartProducts,
        checkoutProducts: state.checkoutProducts,
        hasUnsyncedChanges: state.hasUnsyncedChanges,
        selectedDeliveryOption: state.selectedDeliveryOption,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export const useCartHasHydrated = () => useCartStore((state) => state._hasHydrated);