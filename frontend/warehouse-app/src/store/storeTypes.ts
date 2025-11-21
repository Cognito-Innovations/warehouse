import { EcommerceCategory, EcommerceProduct, LocalCartItem } from "@/types/ecommerce";

export type CategoryStore = {
  selectedCategory: string | null;
  categories: EcommerceCategory[];
  setCategory: (categoryId: string) => void;
  handleCategorySelect: (categoryId: string) => void;
  //TODO: Instead of promise void define actual return typescript data
  getCategories: () => Promise<void>;
};

export type ProductStore = {
    selectedProduct: string | null,
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

export type CartStore = {
  cartProducts: LocalCartItem[];
  cartProductQuantityCount: () => number;
  loading: boolean;
  checkoutProducts: string[];
  toggleCartItemSelection: (productIds: string | string[]) => void;
  clearCheckoutProducts: () => void;
  setLoading: (value: boolean) => void;
  getItemQuantity: (productId: string) => number;
  syncCart: (country?: string) => Promise<void>;
  getCart: (country?: string) => Promise<any[] | undefined>;
  addProductToCart: (product: string | EcommerceProduct, quantity: number, country?: string) => Promise<void>;
  removeProductFromCart: (productId: string, country?: string) => Promise<void>;
}