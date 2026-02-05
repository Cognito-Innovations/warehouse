import { EcommerceCategory, EcommerceProduct } from "@/types/ecommerce";

export type CategoryStore = {
  selectedCategory: string | null;
  categories: EcommerceCategory[];
  loading: boolean;
  setCategory: (categorySlug: string | null) => void;
  handleCategorySelect: (categorySlug: string | null) => void;
  getCategories: (countryCode: string) => Promise<EcommerceCategory[]>;
};

export type ProductStore = {
  selectedProduct: string | null;
  searchQuery: string;
  products: EcommerceProduct[];
  isLoading: boolean;
  loadingMore: boolean;
  error: string | null;
  offset: number;
  hasMore: boolean;
  activeRequestKey: string | null;
  currentDetailProduct: EcommerceProduct | null;
  detailPreviewProducts: EcommerceProduct[];
  detailRelatedProducts: EcommerceProduct[];

  isDetailLoading: boolean;
  arePreviewsLoading: boolean;
  detailError: string | null;
  isLoadingSlug: string | null;

  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  fetchProductBySlug: (slug: string, currency?: string, userId?: string, countryCode?: string) => Promise<EcommerceProduct>;
  getCategoryProducts: (categorySlug: string, currency?: string, countryCode?: string, limit?: number, userId?: string) => Promise<EcommerceProduct[]>;
  handleProductSelect: (productId: string) => void;
  fetchProducts: (params: FetchProductsParams) => Promise<void>;
  loadProductPageData: (slug: string, currency: string, countryCode?: string, userId?: string) => Promise<void>;
  setCurrentDetailProduct: (product: EcommerceProduct) => void;
}

export type FetchProductsParams = {
  category?: string;
  searchTerm?: string;
  currency?: string;
  countryCode?: string;
  userId?: string;
};

export type CartStore = {
  cart: any[];
  userId: string | null;
  isLoading: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setUserId: (userId: string | null) => void;
  removeProductFromCart: (productId: string) => Promise<void>;
  removeEntireProductFromCart: (productId: string) => Promise<void>;
  getCart: () => Promise<void>;
  addProductToCartStore: (productId: string, requestedQty: number) => Promise<void>;
  addProductToCart: (productId: string, requestedQty: number, productStockQty: number) => Promise<void>;
  syncLocalStorageProductsToCartDB: (userId: string) => Promise<void>;
}

export type LocationStore = {
  currencyCode: string;
  currencySymbol: string;
  currencyRate: number;
  countryCode: string;
  isLoaded: boolean;
  fetchLocationBasedOnUser: (userId?: string) => Promise<void>;
}

export type CheckoutState = {
  selectedCargo: string | null;
  selectedProductIds: string[];
  selectCargo: (cargo: string, productIds: string[]) => void;
  toggleProduct: (productId: string) => void;
}