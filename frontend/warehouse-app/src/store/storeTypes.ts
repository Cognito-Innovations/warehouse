import { EcommerceCategory, EcommerceProduct, LocalCartItem, UserAddress } from "@/types/ecommerce";

export type CategoryStore = {
  selectedCategory: string | null;
  categories: EcommerceCategory[];
  setCategory: (categorySlug: string | null) => void;
  handleCategorySelect: (categorySlug: string | null) => void;
  getCategories: (countryCode?: string) => Promise<EcommerceCategory[]>;
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
  cache: Record<string, ProductCacheData>;

  activeRequestKey: string | null;
  currentDetailProduct: EcommerceProduct | null;
  detailPreviewProducts: EcommerceProduct[];
  detailRelatedProducts: EcommerceProduct[];
  detailCache: Record<string, ProductDetailCache>;

  isDetailLoading: boolean;
  arePreviewsLoading: boolean;
  detailError: string | null;
  isLoadingSlug: string | null;

  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  getProducts: (params?: GetProductsParams) => Promise<EcommerceProduct[]>;
  fetchProductBySlug: (slug: string, currency?: string, userId?: string, countryCode?: string) => Promise<EcommerceProduct>;
  getCategoryProducts: (categorySlug: string, currency?: string, countryCode?: string, limit?: number, userId?: string) => Promise<EcommerceProduct[]>;
  handleProductSelect: (productId: string) => void;
  fetchProducts: (
    params: FetchProductsParams,
    reset?: boolean
  ) => Promise<void>;

  loadProductPageData: (slug: string, currency: string, countryCode?: string, userId?: string) => Promise<void>;
  setCurrentDetailProduct: (product: EcommerceProduct) => void;
  resetDetailState: () => void;
  clearProductCache: () => void;
}

export type ProductCacheData = {
  products: EcommerceProduct[];
  hasMore: boolean;
  offset: number;
};

export interface ProductDetailCache {
  product: EcommerceProduct;
  previews: EcommerceProduct[];
  related: EcommerceProduct[];
  timestamp: number;
}

export type GetProductsParams = {
  searchTerm?: string;
  currency?: string;
  category?: string;
  countryCode?: string;
  limit?: number;
  offset?: number;
  userId?: string;
};

export type FetchProductsParams = {
  category?: string;
  searchTerm?: string;
  currency?: string;
  countryCode?: string;
  userId?: string;
};

export type CartStore = {
  cartProducts: LocalCartItem[];
  updatingProducts: Record<string, boolean>;
  cartProductQuantityCount: () => number;
  loading: boolean;
  isSyncing: boolean,
  _hasHydrated: boolean;
  hasUnsyncedChanges: boolean;
  checkoutProducts: string[];
  setCheckoutProducts: (productIds: string[]) => void;
  toggleCartItemSelection: (productIds: string | string[]) => void;
  setCartProducts: (products: any[]) => void;
  clearCheckoutProducts: () => void;
  setLoading: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
  setUpdating: (productId: string, isUpdating: boolean) => void;
  getItemQuantity: (productId: string) => number;
  getLineId: (productId: string, currency?: string, countryCode?: string) => Promise<string | undefined>;
  refreshCart: (currency?: string, countryCode?: string) => Promise<LocalCartItem[]>;
  syncCart: (currency?: string, countryCode?: string) => Promise<void>;
  getCart: (currency?: string, countryCode?: string) => Promise<LocalCartItem[]>;
  addOrIncreaseQty: (product: EcommerceProduct, quantity: number, currency?: string, countryCode?: string) => Promise<void>;
  decreaseProductQty: (product: EcommerceProduct, quantity: number, currency?: string, countryCode?: string) => Promise<void>;
  removeProductFromCart: (productId: string, currency?: string, countryCode?: string) => Promise<void>;
  incrementCartQuantity: (product: EcommerceProduct, currency?: string, countryCode?: string) => Promise<void>;
  decrementCartQuantity: (product: EcommerceProduct, currency?: string, countryCode?: string) => Promise<void>;
  setCartItemQuantity: (productId: string, quantity: number, currency?: string, countryCode?: string) => Promise<void>;
  removePurchasedProducts: (purchasedProductIds: string[]) => void;
}

export type LocationStore = {
  currencyCode: string;
  currencySymbol: string;
  currencyRate: number;
  countryCode: string;
  isLoaded: boolean;
  fetchLocation: (userId?: string) => Promise<void>;
  refreshLocation: (userId?: string) => Promise<void>;
}