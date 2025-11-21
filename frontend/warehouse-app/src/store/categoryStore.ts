import { create } from "zustand";
import { ecommerceService } from "@/services/ecommerce.service";
import { CategoryStore } from "./storeTypes";


const useCategoryStore = create<CategoryStore>((set) => ({
  selectedCategory: null,
  //TODO: Define initial set of category
  categories: [],

  setCategory: (categoryId) => set({ selectedCategory: categoryId }),

  handleCategorySelect: (categoryId) =>
    set({ selectedCategory: categoryId }),

  getCategories: async () => {
    const categories = await ecommerceService.getCategories();
    set({ categories });
  },
}));

export default useCategoryStore;
