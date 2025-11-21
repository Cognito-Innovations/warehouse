import { EcommerceCategory, EcommerceProduct } from "@/types/ecommerce";

export type CategoryStore = {
  selectedCategory: string | null;
  categories: EcommerceCategory[];
  setCategory: (categoryId: string) => void;
  handleCategorySelect: (categoryId: string) => void;
  //TODO: Instead of promise void define actual return typescript data
  getCategories: () => Promise<void>;
};

export type ProductStore = {
    selectedProduct: null,
    products: EcommerceProduct[];
    isLoading: boolean;
    //TODO: Instead of promise void define actual return typescript data
    getProducts: (params?: GetProductsParams) => Promise<void>;
    handleProductSelect: (productId: string) => void;
}

export type GetProductsParams = {
  searchTerm?: string;
  country?: string;
  limit?: number;
  offset?: number;
};