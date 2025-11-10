import { CreateCategoryDto } from '../dto/category/ecommerce-create-category.dto';
import { CreateEcommerceSubCategoryDto } from '../dto/sub_category/create-sub_category.dto';
import { CreateEcommerceProductDto } from '../dto/product/create-product.dto';
import { CargoType } from '../entities/ecommerce-category.entity';

/**
 * Seed data for Categories
 * Note: Replace COUNTRY_ID_PLACEHOLDER with an actual country UUID from your database
 */

export const categorySeedData: Omit<CreateCategoryDto, 'country_id'>[] = [
  {
    name: 'Fruits & Vegetables',
    slug: 'fruits-vegetables',
    discount_percentage: 5,
    image_url:
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
    description: 'Fresh fruits and vegetables delivered to your doorstep',
    is_active: true,
    cargo_type: CargoType.GENERAL_CARGO,
  },
  {
    name: 'Dairy & Eggs',
    slug: 'dairy-eggs',
    discount_percentage: 3,
    image_url:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    description: 'Fresh dairy products and farm eggs',
    is_active: true,
    cargo_type: CargoType.GENERAL_CARGO,
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    discount_percentage: 8,
    image_url:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    description: 'Soft drinks, juices, and other beverages',
    is_active: true,
    cargo_type: CargoType.GENERAL_CARGO,
  },
  {
    name: 'Snacks & Sweets',
    slug: 'snacks-sweets',
    discount_percentage: 10,
    image_url:
      'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    description: 'Chips, cookies, chocolates, and more',
    is_active: true,
    cargo_type: CargoType.GENERAL_CARGO,
  },
  {
    name: 'Bakery & Bread',
    slug: 'bakery-bread',
    discount_percentage: 5,
    image_url:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    description: 'Fresh bread, cakes, and bakery items',
    is_active: true,
    cargo_type: CargoType.GENERAL_CARGO,
  },
  {
    name: 'Meat & Seafood',
    slug: 'meat-seafood',
    discount_percentage: 7,
    image_url:
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
    description: 'Fresh meat and seafood products',
    is_active: true,
    cargo_type: CargoType.GENERAL_CARGO,
  },
  {
    name: 'Frozen Foods',
    slug: 'frozen-foods',
    discount_percentage: 6,
    image_url:
      'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400',
    description: 'Frozen vegetables, ready meals, and ice cream',
    is_active: true,
    cargo_type: CargoType.GENERAL_CARGO,
  },
  {
    name: 'Personal Care',
    slug: 'personal-care',
    discount_percentage: 12,
    image_url:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    description: 'Skincare, haircare, and personal hygiene products',
    is_active: true,
    cargo_type: CargoType.GENERAL_CARGO,
  },
  {
    name: 'Household Essentials',
    slug: 'household-essentials',
    discount_percentage: 4,
    image_url:
      'https://images.unsplash.com/photo-1586075010923-2dd2440d87b0?w=400',
    description: 'Cleaning supplies and household items',
    is_active: true,
    cargo_type: CargoType.GENERAL_CARGO,
  },
  {
    name: 'Baby Care',
    slug: 'baby-care',
    discount_percentage: 15,
    image_url:
      'https://images.unsplash.com/photo-1604917019088-26b603e7b8b1?w=400',
    description: 'Baby food, diapers, and care products',
    is_active: true,
    cargo_type: CargoType.GENERAL_CARGO,
  },
];

/**
 * Seed data for Sub Categories
 * Note: Replace CATEGORY_ID_PLACEHOLDER and COUNTRY_ID_PLACEHOLDER with actual UUIDs
 * The category_id should match the index from categorySeedData array
 * Each category has 2 sub-categories
 */
export const subCategorySeedData: Omit<
  CreateEcommerceSubCategoryDto,
  'category_id' | 'country_id'
>[] = [
  // Fruits & Vegetables sub-categories (category index 0)
  {
    name: 'Fresh Fruits',
    slug: 'fresh-fruits',
    discount_percentage: 5,
    description: 'Seasonal and exotic fruits',
    is_active: true,
  },
  {
    name: 'Fresh Vegetables',
    slug: 'fresh-vegetables',
    discount_percentage: 5,
    description: 'Fresh leafy and root vegetables',
    is_active: true,
  },
  // Dairy & Eggs sub-categories (category index 1)
  {
    name: 'Milk & Cream',
    slug: 'milk-cream',
    discount_percentage: 3,
    description: 'Fresh milk and cream products',
    is_active: true,
  },
  {
    name: 'Cheese & Butter',
    slug: 'cheese-butter',
    discount_percentage: 4,
    description: 'Various cheese and butter options',
    is_active: true,
  },
  // Beverages sub-categories (category index 2)
  {
    name: 'Soft Drinks',
    slug: 'soft-drinks',
    discount_percentage: 10,
    description: 'Carbonated beverages and sodas',
    is_active: true,
  },
  {
    name: 'Juices',
    slug: 'juices',
    discount_percentage: 8,
    description: 'Fresh and packaged juices',
    is_active: true,
  },
  // Snacks & Sweets sub-categories (category index 3)
  {
    name: 'Chips & Crisps',
    slug: 'chips-crisps',
    discount_percentage: 12,
    description: 'Potato chips and crispy snacks',
    is_active: true,
  },
  {
    name: 'Chocolates',
    slug: 'chocolates',
    discount_percentage: 15,
    description: 'Chocolate bars and candies',
    is_active: true,
  },
  // Bakery & Bread sub-categories (category index 4)
  {
    name: 'Bread',
    slug: 'bread',
    discount_percentage: 5,
    description: 'White, brown, and multigrain bread',
    is_active: true,
  },
  {
    name: 'Cakes & Pastries',
    slug: 'cakes-pastries',
    discount_percentage: 8,
    description: 'Fresh cakes and pastries',
    is_active: true,
  },
  // Meat & Seafood sub-categories (category index 5)
  {
    name: 'Chicken',
    slug: 'chicken',
    discount_percentage: 7,
    description: 'Fresh chicken cuts',
    is_active: true,
  },
  {
    name: 'Fish',
    slug: 'fish',
    discount_percentage: 10,
    description: 'Fresh fish and seafood',
    is_active: true,
  },
  // Frozen Foods sub-categories (category index 6)
  {
    name: 'Frozen Vegetables',
    slug: 'frozen-vegetables',
    discount_percentage: 6,
    description: 'Frozen peas, corn, and mixed vegetables',
    is_active: true,
  },
  {
    name: 'Ice Cream',
    slug: 'ice-cream',
    discount_percentage: 12,
    description: 'Ice cream and frozen desserts',
    is_active: true,
  },
  // Personal Care sub-categories (category index 7)
  {
    name: 'Skincare',
    slug: 'skincare',
    discount_percentage: 15,
    description: 'Face wash, moisturizers, and creams',
    is_active: true,
  },
  {
    name: 'Haircare',
    slug: 'haircare',
    discount_percentage: 12,
    description: 'Shampoo, conditioner, and hair oils',
    is_active: true,
  },
  // Household Essentials sub-categories (category index 8)
  {
    name: 'Cleaning Supplies',
    slug: 'cleaning-supplies',
    discount_percentage: 5,
    description: 'Detergents, soaps, and cleaners',
    is_active: true,
  },
  {
    name: 'Paper Products',
    slug: 'paper-products',
    discount_percentage: 4,
    description: 'Tissue paper, napkins, and toilet paper',
    is_active: true,
  },
  // Baby Care sub-categories (category index 9)
  {
    name: 'Baby Food',
    slug: 'baby-food',
    discount_percentage: 18,
    description: 'Baby formula and food products',
    is_active: true,
  },
  {
    name: 'Diapers & Wipes',
    slug: 'diapers-wipes',
    discount_percentage: 15,
    description: 'Baby diapers and wet wipes',
    is_active: true,
  },
];

/**
 * Seed data for Products
 * Note: Replace CATEGORY_ID_PLACEHOLDER, SUB_CATEGORY_ID_PLACEHOLDER,
 * COUNTRY_ID_PLACEHOLDER, and MEASUREMENT_ID_PLACEHOLDER with actual UUIDs
 * Each category has 3 products distributed across 2 sub-categories
 * Some products are randomly set to out of stock (stock_quantity: 0)
 */
export const productSeedData: Omit<
  CreateEcommerceProductDto,
  'category_id' | 'sub_category_id' | 'country_id' | 'measurement_id'
>[] = [
  // Category 0: Fruits & Vegetables
  // Sub-category 0: Fresh Fruits
  {
    name: 'Fresh Red Apples',
    description: 'Crisp and juicy red apples, perfect for snacking',
    slug: 'fresh-red-apples',
    image_url:
      'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
    price: 150,
    discount_percentage: 10,
    unit_value: 1,
    stock_quantity: 50,
    is_active: true,
  },
  {
    name: 'Bananas - Premium',
    description: 'Fresh yellow bananas, rich in potassium',
    slug: 'bananas-premium',
    image_url:
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
    price: 60,
    discount_percentage: 5,
    unit_value: 1,
    stock_quantity: 0, // Out of stock
    is_active: true,
  },
  // Sub-category 1: Fresh Vegetables
  {
    name: 'Fresh Tomatoes',
    description: 'Ripe red tomatoes, perfect for cooking',
    slug: 'fresh-tomatoes',
    image_url:
      'https://images.unsplash.com/photo-1546470427-e26264be0b42?w=400',
    price: 40,
    discount_percentage: 5,
    unit_value: 1,
    stock_quantity: 200,
    is_active: true,
  },

  // Category 1: Dairy & Eggs
  // Sub-category 2: Milk & Cream
  {
    name: 'Fresh Whole Milk',
    description: 'Pure whole milk, pasteurized and fresh',
    slug: 'fresh-whole-milk',
    image_url:
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    price: 65,
    discount_percentage: 3,
    unit_value: 1,
    stock_quantity: 100,
    is_active: true,
  },
  // Sub-category 3: Cheese & Butter
  {
    name: 'Butter - Premium',
    description: 'Creamy butter, perfect for cooking and baking',
    slug: 'butter-premium',
    image_url:
      'https://images.unsplash.com/photo-1589985270826-4b7fe3a787fe?w=400',
    price: 120,
    discount_percentage: 5,
    unit_value: 0.2,
    stock_quantity: 80,
    is_active: true,
  },
  {
    name: 'Cheddar Cheese - Block',
    description: 'Sharp cheddar cheese, 200g block',
    slug: 'cheddar-cheese-block',
    image_url:
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    price: 180,
    discount_percentage: 8,
    unit_value: 0.2,
    stock_quantity: 0, // Out of stock
    is_active: true,
  },

  // Category 2: Beverages
  // Sub-category 4: Soft Drinks
  {
    name: 'Cola - 2L Bottle',
    description: 'Refreshing cola drink, 2 liter bottle',
    slug: 'cola-2l-bottle',
    image_url:
      'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    price: 90,
    discount_percentage: 12,
    unit_value: 2,
    stock_quantity: 150,
    is_active: true,
  },
  {
    name: 'Lemon Soda - 750ml',
    description: 'Sparkling lemon soda, refreshing taste',
    slug: 'lemon-soda-750ml',
    image_url:
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    price: 45,
    discount_percentage: 10,
    unit_value: 0.75,
    stock_quantity: 0, // Out of stock
    is_active: true,
  },
  // Sub-category 5: Juices
  {
    name: 'Orange Juice - Fresh',
    description: '100% fresh orange juice, no added sugar',
    slug: 'orange-juice-fresh',
    image_url:
      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    price: 120,
    discount_percentage: 10,
    unit_value: 1,
    stock_quantity: 70,
    is_active: true,
  },

  // Category 3: Snacks & Sweets
  // Sub-category 6: Chips & Crisps
  {
    name: 'Potato Chips - Classic',
    description: 'Crispy potato chips, classic salted flavor',
    slug: 'potato-chips-classic',
    image_url:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    price: 30,
    discount_percentage: 15,
    unit_value: 0.1,
    stock_quantity: 300,
    is_active: true,
  },
  {
    name: 'Nachos - Cheese Flavor',
    description: 'Crunchy nachos with cheese flavor',
    slug: 'nachos-cheese-flavor',
    image_url:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    price: 50,
    discount_percentage: 12,
    unit_value: 0.15,
    stock_quantity: 150,
    is_active: true,
  },
  // Sub-category 7: Chocolates
  {
    name: 'Dark Chocolate Bar',
    description: 'Premium dark chocolate, 70% cocoa',
    slug: 'dark-chocolate-bar',
    image_url:
      'https://images.unsplash.com/photo-1606312619070-d48b4cbc3e78?w=400',
    price: 150,
    discount_percentage: 18,
    unit_value: 0.1,
    stock_quantity: 120,
    is_active: true,
  },

  // Category 4: Bakery & Bread
  // Sub-category 8: Bread
  {
    name: 'White Bread - Sliced',
    description: 'Fresh white bread, pre-sliced',
    slug: 'white-bread-sliced',
    image_url:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    price: 40,
    discount_percentage: 5,
    unit_value: 0.4,
    stock_quantity: 100,
    is_active: true,
  },
  {
    name: 'Brown Bread - Multigrain',
    description: 'Healthy multigrain brown bread',
    slug: 'brown-bread-multigrain',
    image_url:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    price: 55,
    discount_percentage: 6,
    unit_value: 0.4,
    stock_quantity: 0, // Out of stock
    is_active: true,
  },
  // Sub-category 9: Cakes & Pastries
  {
    name: 'Chocolate Cake',
    description: 'Rich chocolate cake, freshly baked',
    slug: 'chocolate-cake',
    image_url:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    price: 450,
    discount_percentage: 12,
    unit_value: 1,
    stock_quantity: 20,
    is_active: true,
  },

  // Category 5: Meat & Seafood
  // Sub-category 10: Chicken
  {
    name: 'Chicken Breast - Boneless',
    description: 'Fresh boneless chicken breast, skinless',
    slug: 'chicken-breast-boneless',
    image_url:
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
    price: 350,
    discount_percentage: 8,
    unit_value: 0.5,
    stock_quantity: 50,
    is_active: true,
  },
  {
    name: 'Chicken Thighs - Pack',
    description: 'Fresh chicken thighs, 500g pack',
    slug: 'chicken-thighs-pack',
    image_url:
      'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400',
    price: 280,
    discount_percentage: 7,
    unit_value: 0.5,
    stock_quantity: 35,
    is_active: true,
  },
  // Sub-category 11: Fish
  {
    name: 'Fresh Salmon Fillet',
    description: 'Premium fresh salmon fillet, rich in omega-3',
    slug: 'fresh-salmon-fillet',
    image_url:
      'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400',
    price: 800,
    discount_percentage: 12,
    unit_value: 0.5,
    stock_quantity: 0, // Out of stock
    is_active: true,
  },

  // Category 6: Frozen Foods
  // Sub-category 12: Frozen Vegetables
  {
    name: 'Frozen Peas',
    description: 'Frozen green peas, ready to cook',
    slug: 'frozen-peas',
    image_url:
      'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400',
    price: 80,
    discount_percentage: 8,
    unit_value: 0.5,
    stock_quantity: 100,
    is_active: true,
  },
  {
    name: 'Frozen Corn',
    description: 'Sweet frozen corn kernels',
    slug: 'frozen-corn',
    image_url:
      'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400',
    price: 75,
    discount_percentage: 6,
    unit_value: 0.5,
    stock_quantity: 90,
    is_active: true,
  },
  // Sub-category 13: Ice Cream
  {
    name: 'Vanilla Ice Cream',
    description: 'Creamy vanilla ice cream, 1 liter',
    slug: 'vanilla-ice-cream',
    image_url:
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    price: 180,
    discount_percentage: 15,
    unit_value: 1,
    stock_quantity: 60,
    is_active: true,
  },

  // Category 7: Personal Care
  // Sub-category 14: Skincare
  {
    name: 'Face Wash - Gentle',
    description: 'Gentle face wash for all skin types',
    slug: 'face-wash-gentle',
    image_url:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    price: 200,
    discount_percentage: 18,
    unit_value: 0.2,
    stock_quantity: 80,
    is_active: true,
  },
  {
    name: 'Moisturizer - Daily',
    description: 'Daily use moisturizer, 100ml',
    slug: 'moisturizer-daily',
    image_url:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    price: 250,
    discount_percentage: 15,
    unit_value: 0.1,
    stock_quantity: 0, // Out of stock
    is_active: true,
  },
  // Sub-category 15: Haircare
  {
    name: 'Shampoo - Anti-Dandruff',
    description: 'Anti-dandruff shampoo, 400ml',
    slug: 'shampoo-anti-dandruff',
    image_url:
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
    price: 180,
    discount_percentage: 15,
    unit_value: 0.4,
    stock_quantity: 90,
    is_active: true,
  },

  // Category 8: Household Essentials
  // Sub-category 16: Cleaning Supplies
  {
    name: 'Laundry Detergent',
    description: 'Powerful laundry detergent, 2kg',
    slug: 'laundry-detergent',
    image_url:
      'https://images.unsplash.com/photo-1586075010923-2dd2440d87b0?w=400',
    price: 350,
    discount_percentage: 6,
    unit_value: 2,
    stock_quantity: 70,
    is_active: true,
  },
  {
    name: 'Dish Soap - Lemon',
    description: 'Lemon scented dish soap, 500ml',
    slug: 'dish-soap-lemon',
    image_url:
      'https://images.unsplash.com/photo-1586075010923-2dd2440d87b0?w=400',
    price: 85,
    discount_percentage: 5,
    unit_value: 0.5,
    stock_quantity: 120,
    is_active: true,
  },
  // Sub-category 17: Paper Products
  {
    name: 'Toilet Paper - Soft',
    description: 'Soft toilet paper, 12 rolls',
    slug: 'toilet-paper-soft',
    image_url:
      'https://images.unsplash.com/photo-1586075010923-2dd2440d87b0?w=400',
    price: 250,
    discount_percentage: 5,
    unit_value: 12,
    stock_quantity: 100,
    is_active: true,
  },

  // Category 9: Baby Care
  // Sub-category 18: Baby Food
  {
    name: 'Baby Formula - Stage 1',
    description: 'Infant formula, stage 1, 400g',
    slug: 'baby-formula-stage-1',
    image_url:
      'https://images.unsplash.com/photo-1604917019088-26b603e7b8b1?w=400',
    price: 450,
    discount_percentage: 20,
    unit_value: 0.4,
    stock_quantity: 60,
    is_active: true,
  },
  {
    name: 'Baby Cereal - Rice',
    description: 'Organic rice cereal for babies, 200g',
    slug: 'baby-cereal-rice',
    image_url:
      'https://images.unsplash.com/photo-1604917019088-26b603e7b8b1?w=400',
    price: 180,
    discount_percentage: 15,
    unit_value: 0.2,
    stock_quantity: 0, // Out of stock
    is_active: true,
  },
  // Sub-category 19: Diapers & Wipes
  {
    name: 'Baby Diapers - Size M',
    description: 'Soft baby diapers, size medium, pack of 30',
    slug: 'baby-diapers-size-m',
    image_url:
      'https://images.unsplash.com/photo-1604917019088-26b603e7b8b1?w=400',
    price: 650,
    discount_percentage: 18,
    unit_value: 30,
    stock_quantity: 50,
    is_active: true,
  },
];
