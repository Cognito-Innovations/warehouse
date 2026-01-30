export interface EcommerceCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  description?: string;
  is_active: boolean;
  country: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
};

export interface EcommerceSubCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  description?: string;
  is_active: boolean;
  category: EcommerceCategory;
  country: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface EcommerceProduct {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image_url: string;
  price: {
    price: number;
    currency: string;
  };
  discount_percentage: number;
  quantity: number;
  stock_quantity: number;
  unit_value: number;
  measurement?: {
    label: string;
  };
  category: EcommerceCategory;
  sub_category: EcommerceSubCategory;
  country: {
    id: string;
    name: string;
  };
  cargo_option: {
    label: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product_id?: string;
  product: EcommerceProduct;
  quantity: number;
  unit_price: number;
  total_price: number;
  discount_percentage: number;
  discount_amount: number;
  created_at: string;
  updated_at: string;
}

export interface LocalCartItem {
  id?: string;
  product_id: string;
  quantity: number;
  currency?: string;
  product?: EcommerceProduct;
}

export interface Cart {
  id: string;
  user_id: string;
  status: "ACTIVE" | "ABANDONED" | "CHECKED_OUT";
  total_amount: number;
  discount_percentage: number;
  final_amount: number;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product: EcommerceProduct;
  quantity: number;
  unit_price: number;
  total_price: number;
  discount_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  payment_status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  subtotal: number;
  discount_percentage: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  shipping_address?: string;
  billing_address?: string;
  notes?: string;
  items: OrderItem[];
  user: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
  country?: string;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CreateOrderRequest {
  shipping_address?: string;
  billing_address?: string;
  notes?: string;
}

// Component Props Interfaces
export interface EcommerceSearchBarProps {
  searchQuery: string;
  placeholder: string;
  onSearchChange: (value: string) => void;
}

export interface EcommerceCategorySectionProps {
  title: string;
  categories: EcommerceCategory[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  cartItemCount: number;
  onCartClick: () => void;
  forYouLabel: string;
}

export interface EcommerceProductCardProps {
  product: EcommerceProduct;
}

export interface EcommerceProductsGridProps {
  products: EcommerceProduct[];
  loading?: boolean;
}

export interface TodaysDealCarouselProps {
  products: EcommerceProduct[];
  cart: Cart | null;
  onProductClick: (product: EcommerceProduct) => void;
  onAddToCart: (e: React.MouseEvent, product: EcommerceProduct) => void;
  onDecreaseQuantity: (e: React.MouseEvent, product: EcommerceProduct) => void;
  getCartItemQuantity: (productId: string) => number;
  defaultRating: number;
  defaultReviewCount: number;
  outOfStockLabel: string;
  addButtonLabel: string;
}

export interface EcommerceEmptyStateProps {
  title: string;
  description: string;
}

export interface EcommerceBottomNavigationProps {
  cartItemCount: number;
}

export interface EcommerceSkeletonLoaderProps {
  networkError?: string;
  refreshButtonLabel?: string;
  onRefresh?: () => void;
}

export interface EcommerceLoadingStateProps {
  loadingMessage: string;
}

export interface ProductDetailHeaderProps {
  onShareClick?: () => void;
}

export interface ProductDetailImageSectionProps {
  product: EcommerceProduct;
  previewProducts: EcommerceProduct[];
  onProductSelect: (product: EcommerceProduct) => void;
  arePreviewsLoading?: boolean;
}

export interface ProductDetailInfoSectionProps {
  product: EcommerceProduct;
  cart: Cart | null;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, newQuantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  isLoading?: boolean;
}

export interface PromotionalCardProps {
  title: string;
  imageUrl: string;
  backgroundColor: string;
  categoryId: string;
  onShopNow: (categoryId: string) => void;
}

// Cart Page Interfaces
export interface CartItemLoadingState {
  isIncrementLoading: boolean;
  isDecrementLoading: boolean;
  isRemoveLoading: boolean;
}

export interface DeliveryBannerProps {
  text: string;
  icon?: React.ReactNode;
}

export interface DeliveryAddressCardProps {
  recipientName: string;
  pincode: string;
  address: string;
  addressTypeLabel: string;
  changeLabel: string;
  onAddressTypeClick?: () => void;
  onChangeClick?: () => void;
}

export interface CartItemCardProps {
  item: CartItem;
  isSelected: boolean;
  selectedCurrency?: string;
}

export interface CartItemsListProps {
  items: CartItem[];
  loadingStates: Record<string, CartItemLoadingState>;
  selectedItems: Set<string>;
  selectedCurrency?: string;
}

export interface PaymentOffer {
  title: string;
  description: string;
  note?: string;
}

export interface PaymentOffersCardProps {
  title: string;
  offers: PaymentOffer[];
  paymentMethod?: string;
  borderColor: string;
}

export interface FreeDeliveryThresholdCardProps {
  thresholdAmount: number;
  currentAmount: number;
  message: string;
  borderColor: string;
}

export interface OrderSummaryCardProps {
  userId?: string;
  items: CartItem[];
  selectedCurrency?: string;
  selectedAddress: CartAddressData | null;
  setHighlightAddressError(value: boolean): void;
  selectedDeliveryOption?: DeliveryOption | null;
  onBackToDelivery?: () => void;
  onEditAddress?: () => void;
}

export interface EmptyCartStateProps {
  onButtonClick: () => void;
}

export interface AddressSelectionProps {
  addresses: CartAddressData[];
  selectedAddress: CartAddressData | null;
  onAddressSelect: (address: CartAddressData) => void;
  onAddNewAddress: () => void;
  noAddressLabel: string;
  addAddressLabel: string;
  selectAddressLabel: string;
  borderColor: string;
}

export interface CartAddressData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  phone_code?: string;
  phone_number?: string;
  email?: string;
  currency?: string;
}

export interface DeliveryOption {
  delivery_platform: string;
  total_amount: number;
  estimated_time?: string;
}

export interface ComputedCartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  product: EcommerceProduct | null;
  unit_price: number;
  total_price: number;
  delivery_fee: number;
  created_at: number;
  updated_at: number;
}

export interface ComputedCart {
  items: ComputedCartItem[];
  total_amount: number;
  final_amount: number;
  total_delivery_fee?: number;
  currency?: string;
}

export interface UserAddress {
  id: string;
  city: string;
  zip_code: string;
  country: string;
  user: {
    preference: {
      currency: {
        currency_symbol: string;
        currency_code: string;
        rate: string;
      };
    };
  };
}

export interface ProductCartActionsProps {
  product: EcommerceProduct;
  cart: Cart | null | undefined;
  discountPriceRaw: number;
  currency: string;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (itemId: string, newQuantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
}