import { EcommerceCategory, EcommerceProduct, LocalCartItem, UserAddress, DeliveryOption } from "@/types/ecommerce";

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
  cartProducts: LocalCartItem[];
  updatingProducts: Record<string, boolean>;
  cartProductQuantityCount: () => number;
  loading: boolean;
  isSyncing: boolean,
  _hasHydrated: boolean;
  hasUnsyncedChanges: boolean;
  checkoutProducts: string[];
  selectedDeliveryOption: DeliveryOption | null;
  setCheckoutProducts: (productIds: string[]) => void;
  setSelectedDeliveryOption: (option: DeliveryOption | null) => void;
  toggleCartItemSelection: (productIds: string | string[]) => void;
  setCartProducts: (products: any[]) => void;
  clearCheckoutProducts: () => void;
  setLoading: (value: boolean) => void;
  setHasHydrated: (value: boolean) => void;
  setUpdating: (productId: string, isUpdating: boolean) => void;
  getItemQuantity: (productId: string) => number;
  getServerCartItemId: (productId: string, currency?: string, countryCode?: string) => Promise<string | undefined>;
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
  refreshLocation: (userId?: string) => Promise<void>;
  loadLocation: (userId?: string, skipCache?: boolean) => Promise<void>;
}