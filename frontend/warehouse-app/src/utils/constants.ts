export enum ROUTES {
  SIGN_IN = "/sign-in",  
  DASHBOARD = "/dashboard",  
  DASHBOARD_PACKAGES = "/packages",
  DASHBOARD_SHIPMENTS = "/shipments",
  PROFILE = "/profile",
  PICKUP_REQUEST = "/pickup-request",
  CREATE_PICKUP_REQUEST = "/pickup-request/create-request",
  ORDER_HISTORY = "/ecommerce/orders",
  SHIPMENT = "/shipment",
  ECOMMERCE = "/ecommerce",
  PRODUCT = "/ecommerce/product",
  CART = "/ecommerce/cart",
  CHECKOUT = "/ecommerce/checkout",
  ASSISTED_SHOPPING = "/ecommerce/assisted-shopping",
  CREATE_ASSISTED_SHOPPING = "/assisted-shopping/create-request"
}

export const IMAGE_FILE_REGEX = /\.(jpeg|jpg|png|gif|webp)$/i;

export const steps = [
    {
      number: 1,
      text: "Fill out the shopping request form. Always remember to specify the product variations (eg: Size, Color or other variations)"
    },
    {
      number: 2,
      text: "You will receive a quotation for the shopping request. Every quotation will be automatically cancelled within 5 days."
    },
    {
      number: 3,
      text: "Once you approve the quotation, an Invoice will be sent to settle the payment for the shopping request. If you fail to pay for the invoice within 48hrs, the invoice & the shopping request will be cancelled automatically."
    },
    {
      number: 4,
      text: "After the payment for your order is approved, our team will process the order and make the purchase on your behalf."
    },
    {
      number: 5,
      text: "We will log the items as they are received to your Palakart suite. You can also view the shopping request status & item's status from your assisted shopping request portal."
    },
    {
      number: 6,
      text: "When all of the items are received to your suite, create a shipping request to ship out your packages to final destination."
    }
  ];

export const STORAGE_KEY = "warehouse:clientIdentifier";
export const HEADER_KEY = "x-client-identifier";

export const DEFAULT_IMG =
  "https://rukminim2.flixcart.com/fk-p-flap/108/108/image/eb75e5d9571bde1a.png?q=60";

export const ASSISTED_SHOPPING_PRODUCT_LINK_KEY = "assisted_shopping_product_link";

export const orderStatusPhrases: { [key: string]: string } = {
  delivered: "Delivered",
  cancelled: "Cancelled",
  shipped: "Shipped",
  pending: "Pending",
};

export const CACHE_GUEST_LOCATION_KEY = "guest_location";

export const DEFAULT_CURRENCY_INFO = {
  code: "USD",
  symbol: "$",
  rate: 1.00,
}

export const INR_CURRENCY = {
  code: 'INR',
  symbol: '₹',
  rate: 90.25,
}

export const ASSISTED_SHOPPING_STEPS = [
  { number: 1, label: "LINK" },
  { number: 2, label: "DETAILS" },
  { number: 3, label: "COMPLETE" },
];