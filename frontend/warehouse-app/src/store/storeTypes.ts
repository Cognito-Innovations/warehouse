import { EcommerceCategory, EcommerceProduct, LocalCartItem, UserAddress } from "@/types/ecommerce";

export type CategoryStore = {
  selectedCategory: string | null;
  categories: EcommerceCategory[];
  setCategory: (categoryId: string | null) => void;
  handleCategorySelect: (categoryId: string | null) => void;
  getCategories: () => Promise<EcommerceCategory[]>;
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
  fetchProductBySlug: (slug: string, currency?: string, userId?: string) => Promise<EcommerceProduct>;
  getCategoryProducts: (categoryId: string, currency?: string, limit?: number, userId?: string) => Promise<EcommerceProduct[]>;
  handleProductSelect: (productId: string) => void;
  fetchProducts: (
    params: FetchProductsParams,
    reset?: boolean
  ) => Promise<void>;

  loadProductPageData: (slug: string, currency: string, userId?: string) => Promise<void>;
  setCurrentDetailProduct: (product: EcommerceProduct) => void;
  resetDetailState: () => void;
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
  limit?: number;
  offset?: number;
  userId?: string;
};

export type FetchProductsParams = {
  category?: string;
  searchTerm?: string;
  currency?: string;
  userId?: string;
};

export type CartStore = {
  cartProducts: LocalCartItem[];
  updatingProducts: Record<string, boolean>;
  cartProductQuantityCount: () => number;
  loading: boolean;
  isSyncing: boolean,
  _hasHydrated: boolean;
  checkoutProducts: string[];
  toggleCartItemSelection: (productIds: string | string[]) => void;
  setCartProducts: (products: any[]) => void;
  clearCheckoutProducts: () => void;
  setLoading: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
  setUpdating: (productId: string, isUpdating: boolean) => void;
  getItemQuantity: (productId: string) => number;
  getLineId: (productId: string, currency?: string) => Promise<string | undefined>;
  refreshCart: (currency?: string) => Promise<LocalCartItem[]>;
  syncCart: (currency?: string) => Promise<void>;
  getCart: (currency?: string) => Promise<LocalCartItem[]>;
  addOrIncreaseQty: (product: EcommerceProduct, quantity: number, currency?: string) => Promise<void>;
  decreaseProductQty: (product: EcommerceProduct, quantity: number, currency?: string) => Promise<void>;
  removeProductFromCart: (productId: string, currency?: string) => Promise<void>;
  incrementCartQuantity: (product: EcommerceProduct, currency?: string) => Promise<void>;
  decrementCartQuantity: (product: EcommerceProduct, currency?: string) => Promise<void>;
  setCartItemQuantity: (productId: string, quantity: number, currency?: string) => Promise<void>;
  removePurchasedProducts: (purchasedProductIds: string[]) => void;
}

export interface UserLocation {
  city: string;
  pincode: string;
  countryCode?: string;
  countryName?: string;
  currency?: string;
}

export interface EffectiveUserLocation {
  countryCode?: string;
  countryName?: string;
  city?: string;
  pincode?: string;
  currency?: string;
}

export type LocationStore = {
  userLocation: UserLocation;
  userAddress: UserAddress | null;
  addressCache: Record<string, UserAddress | null>;
  isLoadingLocation: boolean;
  isLoadingAddress: boolean;
  hasInitialized: boolean;
  error: string | null;

  setUserLocation: (location: UserLocation) => void;
  setUserAddress: (address: UserAddress | null) => void;
  setLoadingLocation: (loading: boolean) => void;
  setLoadingAddress: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeLocation: (
    defaultCity: string,
    defaultPincode: string,
    enableGeolocation?: boolean
  ) => Promise<void>;
  fetchCountryFromIP: (
    defaultCity: string,
    defaultPincode: string,
    enableGeolocation?: boolean
  ) => Promise<void>;
  fetchUserAddress: (userId: string) => Promise<void>;
  refreshUserAddress: (userId: string) => Promise<void>;
  requestLocation: (enableGeolocation?: boolean) => void;
  updateLocation: (newLocation: UserLocation) => void;
  clearLocation: () => void;
}