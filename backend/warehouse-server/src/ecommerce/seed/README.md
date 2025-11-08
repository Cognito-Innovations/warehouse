# Ecommerce Seed Data

This directory contains seed data and services for populating the ecommerce database with initial data.

## Contents

- **seed-data.ts**: Contains seed data for:
  - 10 Categories (Fruits & Vegetables, Dairy, Beverages, Snacks, Bakery, Meat & Seafood, Frozen Foods, Personal Care, Household, Baby Care)
  - 20 Sub-categories (2 per category)
  - 30 Products (3 per category, distributed across sub-categories, with some out of stock)

- **seed.service.ts**: Service that handles the seeding logic
- **seed.controller.ts**: Controller endpoint to trigger seeding

## How to Use

### Seeding Data

Once your server is running, make a POST request to:

```bash
POST http://localhost:3001/seed/ecommerce
```

Or using curl:
```bash
curl -X POST http://localhost:3001/seed/ecommerce
```

This will:
1. Find or create a default country (uses the first available country in the database)
2. Find or create default measurements (kg, g, L, ml, piece, pack)
3. Create all categories
4. Create all sub-categories (mapped to their categories)
5. Create all products (mapped to categories and sub-categories)

**Response:**
```json
{
  "message": "Ecommerce data seeded successfully",
  "categories": 10,
  "subCategories": 20,
  "products": 30
}
```

### Cleaning Up Seed Data

To delete all seed data while preserving user data (users, carts, orders), make a DELETE request:

```bash
DELETE http://localhost:3001/seed/ecommerce
```

Or using curl:
```bash
curl -X DELETE http://localhost:3001/seed/ecommerce
```

**By default, this will:**
- Delete all seed products
- Delete all seed sub-categories
- Delete all seed categories
- Delete cart items that reference seed products (cart structures preserved)
- **Preserve order items** (order history is kept intact)

**Response:**
```json
{
  "message": "Seed data cleaned up successfully",
  "deleted": {
    "cartItems": 5,
    "orderItems": 0,
    "products": 30,
    "subCategories": 20,
    "categories": 10
  },
  "preserved": {
    "users": "All user accounts preserved",
    "carts": "Cart structures preserved (items referencing seed products removed)",
    "orders": "Order history preserved (order items referencing seed products kept)"
  }
}
```

#### Delete Order Items Too (Optional)

If you want to also delete order items that reference seed products (this will break order history for those products), add the query parameter:

```bash
DELETE http://localhost:3001/seed/ecommerce?deleteOrderItems=true
```

Or using curl:
```bash
curl -X DELETE "http://localhost:3001/seed/ecommerce?deleteOrderItems=true"
```

**⚠️ Warning:** Setting `deleteOrderItems=true` will permanently delete order items referencing seed products, which may break order history and reports.

### Using the Service Directly

You can also import and use the `SeedService` in your code:

```typescript
import { SeedService } from './seed/seed.service';

// Seed data
const seedResult = await seedService.seedAll();

// Cleanup seed data (preserve order history)
const cleanupResult = await seedService.cleanupSeedData(false);

// Cleanup seed data (also delete order items)
const fullCleanupResult = await seedService.cleanupSeedData(true);
```

## Data Structure

### Categories (10 total)
1. Fruits & Vegetables
2. Dairy & Eggs
3. Beverages
4. Snacks & Sweets
5. Bakery & Bread
6. Meat & Seafood
7. Frozen Foods
8. Personal Care
9. Household Essentials
10. Baby Care

### Sub-categories (20 total)
Each category has exactly 2 sub-categories. For example:
- Fruits & Vegetables: Fresh Fruits, Fresh Vegetables
- Dairy & Eggs: Milk & Cream, Cheese & Butter
- And so on...

### Products (30 total)
Each category has exactly 3 products distributed across its 2 sub-categories. For example:
- Fruits & Vegetables: 2 products in Fresh Fruits, 1 in Fresh Vegetables
- Dairy & Eggs: 1 product in Milk & Cream, 2 in Cheese & Butter

**Out of Stock Products (7 products):**
- Bananas - Premium
- Cheddar Cheese - Block
- Lemon Soda - 750ml
- Brown Bread - Multigrain
- Fresh Salmon Fillet
- Moisturizer - Daily
- Baby Cereal - Rice

## Notes

### Seeding
- The seed service checks for existing data before creating new records (based on slug)
- If a category/sub-category/product already exists, it will skip it
- The service automatically uses the first available country in your database
- Default measurements are created if none exist
- All products are set as `is_active: true` by default

### Cleanup
- Only deletes data that matches the seed slugs (from `seed-data.ts`)
- **User data is always preserved** (user accounts, user preferences, etc.)
- Cart structures are preserved (only items referencing seed products are removed)
- Order history is preserved by default (order items are kept unless `deleteOrderItems=true`)
- The cleanup process is safe to run multiple times (idempotent)
- If no seed data is found, the cleanup will return a message indicating so

### Testing Workflow

For testing purposes, you can use this workflow:

1. **Seed the database:**
   ```bash
   POST /seed/ecommerce
   ```

2. **Run your tests** (users can create accounts, add items to cart, place orders, etc.)

3. **Clean up seed data before next test run:**
   ```bash
   DELETE /seed/ecommerce
   ```

4. **Re-seed for next test:**
   ```bash
   POST /seed/ecommerce
   ```

This ensures a clean state for each test run while preserving user accounts and test data.

## Customization

To modify the seed data:
1. Edit `seed-data.ts` to add/remove/modify categories, sub-categories, or products
2. Update the mapping logic in `seed.service.ts` if you change the structure
3. Re-run the seed endpoint

## Requirements

- A country must exist in the database (or the service will create a default one)
- The database connection must be properly configured
- All required entities must be properly set up in TypeORM

