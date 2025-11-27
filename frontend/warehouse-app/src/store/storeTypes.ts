import { EcommerceCategory, EcommerceProduct, LocalCartItem } from "@/types/ecommerce";

export type CategoryStore = {
  selectedCategory: string | null;
  categories: EcommerceCategory[];
  setCategory: (categoryId: string | null) => void;
  handleCategorySelect: (categoryId: string | null) => void;
  getCategories: () => Promise<EcommerceCategory[]>;
};

export type ProductStore = {
  selectedProduct: string | null,
  searchQuery: string;
  products: EcommerceProduct[];
  isLoading: boolean;
  loadingMore: boolean;
  error: string | null;
  offset: number;
  hasMore: boolean;
  cache: Record<string, ProductCacheData>;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  getProducts: (params?: GetProductsParams) => Promise<EcommerceProduct[]>;
  handleProductSelect: (productId: string) => void;
  fetchProducts: (
    params: { category?: string; searchTerm?: string; country?: string },
    reset?: boolean
  ) => Promise<void>;
}

export type ProductCacheData = {
  products: EcommerceProduct[];
  hasMore: boolean;
  offset: number;
};

export type GetProductsParams = {
  searchTerm?: string;
  country?: string;
  category?: string;
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
  addOrIncreaseQty: (product: EcommerceProduct, quantity: number, country?: string) => Promise<void>;
  decreaseProductQty: (product: EcommerceProduct, quantity: number, country?: string) => Promise<void>;
  removeProductFromCart: (productId: string, country?: string) => Promise<void>;
  incrementCartQuantity: (product: EcommerceProduct, country?: string) => Promise<void>;
  decrementCartQuantity: (product: EcommerceProduct, country?: string) => Promise<void>;
  setCartItemQuantity: (productId: string, quantity: number, country?: string) => Promise<void>;
}