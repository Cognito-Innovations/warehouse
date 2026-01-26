import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ecommerceService } from "@/services/ecommerce.service";
import { CategoryStore } from "./storeTypes";
import type { EcommerceCategory } from "@/types/ecommerce";

const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      selectedCategory: null,
      categories: [],

      setCategory: (categorySlug: string | null) => set({ selectedCategory: categorySlug }),

      handleCategorySelect: (categorySlug: string | null) =>
        set({ selectedCategory: categorySlug }),

      getCategories: async (countryCode: string) => {
        const currentCategories = get().categories;
        if (currentCategories.length > 0) {
          return currentCategories;
        }

        const categories: EcommerceCategory[] = await ecommerceService.getCategories(countryCode);
        set({ categories });
        return categories;
      },
    }),
    {
      name: "category-storage",
      partialize: (state) => ({ selectedCategory: state.selectedCategory }),
    }
  )
);

export default useCategoryStore;
