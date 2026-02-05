import { create } from "zustand";
import { CheckoutState } from "./storeTypes";

export const useCheckout = create<CheckoutState>((set, get) => ({
  selectedCargo: null,
  selectedProductIds: [],

  selectCargo: (cargo, productIds) =>
    set({
      selectedCargo: cargo,
      selectedProductIds: productIds,
    }),

  toggleProduct: (productId) => {
    const { selectedProductIds } = get();
    const isCurrentlySelected = selectedProductIds.includes(productId);

    if (isCurrentlySelected) {
      const newIds = selectedProductIds.filter((id) => id !== productId);

      if (newIds.length === 0) {
        set({
          selectedProductIds: [],
          selectedCargo: null,
        });
      } else {
        set({ selectedProductIds: newIds });
      }
    } else {
      set({ selectedProductIds: [...selectedProductIds, productId] });
    }
  },
}));