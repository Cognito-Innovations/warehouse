# Ecommerce Implementation

This document describes the ecommerce implementation for the warehouse application, focusing on fresh & grocery items.

## Features

### Frontend Features
- **Product Catalog**: Browse products with categories and subcategories
- **Search Functionality**: Search products by name or description
- **Product Details**: Detailed product view with images, pricing, and descriptions
- **Shopping Cart**: Add/remove items, update quantities, view cart total
- **Checkout Process**: Complete order placement with delivery information
- **Order Management**: View order history and order details
- **Mobile Responsive**: Optimized for both mobile and desktop devices

### Backend Features
- **Product Management**: CRUD operations for products
- **Category Management**: Organize products by categories and subcategories
- **Cart Management**: User-specific cart with add/remove/update functionality
- **Order Management**: Complete order lifecycle from creation to delivery
- **Authentication**: JWT-based authentication for secure operations

## Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **Material UI v7**: Component library for consistent design
- **TypeScript**: Type-safe development
- **Zustand**: State management for cart
- **Axios**: HTTP client for API calls
- **Sonner**: Toast notifications

### Backend
- **NestJS**: Node.js framework
- **TypeORM**: Database ORM
- **PostgreSQL**: Database (assumed)
- **JWT**: Authentication
- **Class Validator**: DTO validation

## API Endpoints

### Categories
- `GET /ecommerce-categories` - Get all categories
- `GET /ecommerce-categories/:id` - Get category by ID

### Sub Categories
- `GET /ecommerce-sub-categories` - Get all subcategories
- `GET /ecommerce-sub-categories/:id` - Get subcategory by ID

### Products
- `GET /ecommerce-products` - Get all products
- `GET /ecommerce-products/:id` - Get product by ID

### Cart
- `GET /ecommerce-cart` - Get user's cart
- `POST /ecommerce-cart/add` - Add item to cart
- `PUT /ecommerce-cart/items/:itemId` - Update cart item quantity
- `DELETE /ecommerce-cart/items/:itemId` - Remove item from cart
- `DELETE /ecommerce-cart/clear` - Clear entire cart

### Orders
- `POST /ecommerce-orders` - Create new order
- `GET /ecommerce-orders` - Get user's orders
- `GET /ecommerce-orders/:id` - Get order by ID
- `PUT /ecommerce-orders/:id/status` - Update order status
- `PUT /ecommerce-orders/:id/payment-status` - Update payment status
- `PUT /ecommerce-orders/:id/cancel` - Cancel order

## File Structure

```
frontend/warehouse-app/src/
├── app/
│   └── ecommerce/
│       ├── page.tsx                 # Main ecommerce page
│       ├── checkout/
│       │   └── page.tsx            # Checkout page
│       └── orders/
│           ├── page.tsx            # Orders list page
│           └── [id]/
│               └── page.tsx        # Order detail page
├── components/
│   └── ecommerce/
│       ├── ProductCard.tsx         # Product card component
│       ├── CategoryFilter.tsx      # Category filter component
│       ├── CartDrawer.tsx          # Shopping cart drawer
│       └── ProductDetailModal.tsx  # Product detail modal
├── contexts/
│   └── CartContext.tsx             # Cart state management
├── services/
│   └── ecommerce.service.ts        # API service functions
└── types/
    └── ecommerce.ts                # TypeScript type definitions
```

## Usage

### Accessing the Ecommerce
1. Navigate to `/ecommerce` in the application
2. Browse products by category or search
3. Click on products to view details
4. Add items to cart using the "+" button
5. View cart by clicking the cart icon
6. Proceed to checkout to place orders

### Key Components

#### ProductCard
- Displays product image, name, price, and discount
- Shows quantity controls when item is in cart
- Handles add to cart functionality

#### CartDrawer
- Side drawer showing cart contents
- Quantity adjustment controls
- Remove items functionality
- Checkout button

#### ProductDetailModal
- Full product details view
- Quantity selection
- Add to cart with custom quantity

## Mobile Responsiveness

The implementation is fully responsive with:
- Mobile-first design approach
- Responsive grid layouts
- Touch-friendly interface elements
- Optimized for both portrait and landscape orientations
- Adaptive navigation and cart interfaces

## State Management

Cart state is managed using React Context with the following features:
- Persistent cart across page refreshes
- Real-time updates when items are added/removed
- Optimistic updates for better UX
- Error handling and loading states

## Future Enhancements

- Payment integration
- User reviews and ratings
- Wishlist functionality
- Product recommendations
- Inventory management
- Order tracking
- Push notifications
- Multi-language support
