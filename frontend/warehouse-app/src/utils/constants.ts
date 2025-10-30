export enum ROUTES {
  SIGN_IN = "/sign-in",  
  DASHBOARD = "/dashboard",  
  PROFILE = "/profile",
  PICKUP_REQUEST = "/pickup-request",
  ORDER_HISTORY = "/order",
  SHIPMENT = "/shipment",
  ECOMMERCE = "/ecommerce",
  PRODUCT = "/ecommerce/product",
  CART = "/ecommerce/cart",
  CHECKOUT = "/ecommerce/checkout",
  ORDER = "/ecommerce/orders",
  ASSISTED_SHOPPING = "/assisted-shopping",
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