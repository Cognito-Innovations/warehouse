import { create } from "zustand";
import { ecommerceService } from "@/services/ecommerce.service";
import { CategoryStore } from "./storeTypes";
import type { EcommerceCategory } from "@/types/ecommerce";


const useCategoryStore = create<CategoryStore>((set, get) => ({
  selectedCategory: null,
  categories: [],

  setCategory: (categoryId: string | null) => set({ selectedCategory: categoryId }),

  handleCategorySelect: (categoryId: string | null) =>
    set({ selectedCategory: categoryId }),

  getCategories: async () => {
    const currentCategories = get().categories;
    if (currentCategories.length > 0) {
      return currentCategories;
    }
    
    const categories: EcommerceCategory[] = await ecommerceService.getCategories();
    set({ categories });
    return categories;
  },
}));

export default useCategoryStore;
