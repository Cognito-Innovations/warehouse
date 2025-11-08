import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Country } from 'src/Countries/country.entity';
import { EcommerceCategory } from '../entities/ecommerce-category.entity';
import { EcommerceSubCategory } from '../entities/ecommerce-sub-category.entity';
import { EcommerceProduct } from '../entities/ecommerce-product.entity';
import { EcommerceMeasurement } from '../entities/measurement.entity';
import { EcommerceCartItem } from '../entities/ecommerce-cart-item.entity';
import { EcommerceOrderItem } from '../entities/ecommerce-order-item.entity';
import {
  categorySeedData,
  subCategorySeedData,
  productSeedData,
} from './seed-data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(EcommerceCategory)
    private readonly categoryRepository: Repository<EcommerceCategory>,
    @InjectRepository(EcommerceSubCategory)
    private readonly subCategoryRepository: Repository<EcommerceSubCategory>,
    @InjectRepository(EcommerceProduct)
    private readonly productRepository: Repository<EcommerceProduct>,
    @InjectRepository(EcommerceMeasurement)
    private readonly measurementRepository: Repository<EcommerceMeasurement>,
    @InjectRepository(EcommerceCartItem)
    private readonly cartItemRepository: Repository<EcommerceCartItem>,
    @InjectRepository(EcommerceOrderItem)
    private readonly orderItemRepository: Repository<EcommerceOrderItem>,
  ) {}

  async seedAll() {
    this.logger.log('Starting seed process...');

    try {
      // Get or create default country
      const country = await this.getOrCreateDefaultCountry();
      this.logger.log(`Using country: ${country.name} (${country.id})`);

      // Get or create default measurement
      const measurement = await this.getOrCreateDefaultMeasurement();
      this.logger.log(`Using measurement: ${measurement.label} (${measurement.id})`);

      // Seed categories
      const categories = await this.seedCategories(country.id);
      this.logger.log(`Created ${categories.length} categories`);

      // Seed sub-categories
      const subCategories = await this.seedSubCategories(
        categories,
        country.id,
      );
      this.logger.log(`Created ${subCategories.length} sub-categories`);

      // Seed products
      const products = await this.seedProducts(
        categories,
        subCategories,
        country.id,
        measurement.id,
      );
      this.logger.log(`Created ${products.length} products`);

      this.logger.log('Seed process completed successfully!');
      return {
        categories: categories.length,
        subCategories: subCategories.length,
        products: products.length,
      };
    } catch (error) {
      this.logger.error('Error during seed process:', error);
      throw error;
    }
  }

  private async getOrCreateDefaultCountry(): Promise<Country> {
    let country = await this.countryRepository.findOne({
      where: {},
      order: { created_at: 'ASC' },
    });

    if (!country) {
      // Create a default country if none exists
      country = this.countryRepository.create({
        code: 'USA' as any,
        name: 'United States',
        phone_code: '+1',
      });
      country = await this.countryRepository.save(country);
      this.logger.log('Created default country');
    }

    return country;
  }

  private async getOrCreateDefaultMeasurement(): Promise<EcommerceMeasurement> {
    let measurement = await this.measurementRepository.findOne({
      where: {},
      order: { created_at: 'ASC' },
    });

    if (!measurement) {
      // Create default measurements
      const measurements = [
        { label: 'kg' },
        { label: 'g' },
        { label: 'L' },
        { label: 'ml' },
        { label: 'piece' },
        { label: 'pack' },
      ];

      const created = await this.measurementRepository.save(
        measurements.map((m) => this.measurementRepository.create(m)),
      );
      measurement = created[0];
      this.logger.log('Created default measurements');
    }

    return measurement;
  }

  private async seedCategories(countryId: string): Promise<EcommerceCategory[]> {
    const categories: EcommerceCategory[] = [];

    for (const categoryData of categorySeedData) {
      const existing = await this.categoryRepository.findOne({
        where: { slug: categoryData.slug },
      });

      if (existing) {
        this.logger.log(`Category ${categoryData.slug} already exists, skipping`);
        categories.push(existing);
        continue;
      }

      const category = this.categoryRepository.create({
        ...categoryData,
        country: { id: countryId } as Country,
      });

      const saved = await this.categoryRepository.save(category);
      categories.push(saved);
    }

    return categories;
  }

  private async seedSubCategories(
    categories: EcommerceCategory[],
    countryId: string,
  ): Promise<EcommerceSubCategory[]> {
    const subCategories: EcommerceSubCategory[] = [];

    // Map sub-categories to categories based on index
    // Each category has 2 sub-categories
    const subCategoryToCategoryMap = [
      0, 0, // Fresh Fruits, Fresh Vegetables -> Fruits & Vegetables
      1, 1, // Milk & Cream, Cheese & Butter -> Dairy & Eggs
      2, 2, // Soft Drinks, Juices -> Beverages
      3, 3, // Chips & Crisps, Chocolates -> Snacks & Sweets
      4, 4, // Bread, Cakes & Pastries -> Bakery & Bread
      5, 5, // Chicken, Fish -> Meat & Seafood
      6, 6, // Frozen Vegetables, Ice Cream -> Frozen Foods
      7, 7, // Skincare, Haircare -> Personal Care
      8, 8, // Cleaning Supplies, Paper Products -> Household Essentials
      9, 9, // Baby Food, Diapers & Wipes -> Baby Care
    ];

    for (let i = 0; i < subCategorySeedData.length; i++) {
      const subCategoryData = subCategorySeedData[i];
      const categoryIndex = subCategoryToCategoryMap[i];
      const category = categories[categoryIndex];

      if (!category) {
        this.logger.warn(
          `No category found for sub-category ${subCategoryData.slug}, skipping`,
        );
        continue;
      }

      const existing = await this.subCategoryRepository.findOne({
        where: { slug: subCategoryData.slug },
      });

      if (existing) {
        this.logger.log(
          `Sub-category ${subCategoryData.slug} already exists, skipping`,
        );
        subCategories.push(existing);
        continue;
      }

      const subCategory = this.subCategoryRepository.create({
        ...subCategoryData,
        category: category,
        country: { id: countryId } as Country,
      });

      const saved = await this.subCategoryRepository.save(subCategory);
      subCategories.push(saved);
    }

    return subCategories;
  }

  private async seedProducts(
    categories: EcommerceCategory[],
    subCategories: EcommerceSubCategory[],
    countryId: string,
    measurementId: string,
  ): Promise<EcommerceProduct[]> {
    const products: EcommerceProduct[] = [];

    // Map products to categories and sub-categories
    // Each category has 3 products distributed across 2 sub-categories
    const productMappings = [
      // Category 0: Fruits & Vegetables (3 products)
      { categoryIdx: 0, subCategoryIdx: 0, count: 2 }, // Fresh Fruits: 2 products
      { categoryIdx: 0, subCategoryIdx: 1, count: 1 }, // Fresh Vegetables: 1 product
      // Category 1: Dairy & Eggs (3 products)
      { categoryIdx: 1, subCategoryIdx: 2, count: 1 }, // Milk & Cream: 1 product
      { categoryIdx: 1, subCategoryIdx: 3, count: 2 }, // Cheese & Butter: 2 products
      // Category 2: Beverages (3 products)
      { categoryIdx: 2, subCategoryIdx: 4, count: 2 }, // Soft Drinks: 2 products
      { categoryIdx: 2, subCategoryIdx: 5, count: 1 }, // Juices: 1 product
      // Category 3: Snacks & Sweets (3 products)
      { categoryIdx: 3, subCategoryIdx: 6, count: 2 }, // Chips & Crisps: 2 products
      { categoryIdx: 3, subCategoryIdx: 7, count: 1 }, // Chocolates: 1 product
      // Category 4: Bakery & Bread (3 products)
      { categoryIdx: 4, subCategoryIdx: 8, count: 2 }, // Bread: 2 products
      { categoryIdx: 4, subCategoryIdx: 9, count: 1 }, // Cakes & Pastries: 1 product
      // Category 5: Meat & Seafood (3 products)
      { categoryIdx: 5, subCategoryIdx: 10, count: 2 }, // Chicken: 2 products
      { categoryIdx: 5, subCategoryIdx: 11, count: 1 }, // Fish: 1 product
      // Category 6: Frozen Foods (3 products)
      { categoryIdx: 6, subCategoryIdx: 12, count: 2 }, // Frozen Vegetables: 2 products
      { categoryIdx: 6, subCategoryIdx: 13, count: 1 }, // Ice Cream: 1 product
      // Category 7: Personal Care (3 products)
      { categoryIdx: 7, subCategoryIdx: 14, count: 2 }, // Skincare: 2 products
      { categoryIdx: 7, subCategoryIdx: 15, count: 1 }, // Haircare: 1 product
      // Category 8: Household Essentials (3 products)
      { categoryIdx: 8, subCategoryIdx: 16, count: 2 }, // Cleaning Supplies: 2 products
      { categoryIdx: 8, subCategoryIdx: 17, count: 1 }, // Paper Products: 1 product
      // Category 9: Baby Care (3 products)
      { categoryIdx: 9, subCategoryIdx: 18, count: 2 }, // Baby Food: 2 products
      { categoryIdx: 9, subCategoryIdx: 19, count: 1 }, // Diapers & Wipes: 1 product
    ];

    let productIndex = 0;

    for (const mapping of productMappings) {
      const category = categories[mapping.categoryIdx];
      const subCategory = subCategories[mapping.subCategoryIdx];

      if (!category || !subCategory) {
        this.logger.warn(
          `Missing category or sub-category for mapping, skipping`,
        );
        continue;
      }

      for (let i = 0; i < mapping.count && productIndex < productSeedData.length; i++) {
        const productData = productSeedData[productIndex];

        const existing = await this.productRepository.findOne({
          where: { slug: productData.slug },
        });

        if (existing) {
          this.logger.log(
            `Product ${productData.slug} already exists, skipping`,
          );
          products.push(existing);
          productIndex++;
          continue;
        }

        const product = this.productRepository.create({
          ...productData,
          category: category,
          sub_category: subCategory,
          country: { id: countryId } as Country,
          measurement: { id: measurementId } as EcommerceMeasurement,
        });

        const saved = await this.productRepository.save(product);
        products.push(saved);
        productIndex++;
      }
    }

    return products;
  }

  /**
   * Clean up seed data (categories, sub-categories, and products)
   * This will delete all seed data while preserving user data (users, carts, orders)
   * 
   * @param deleteOrderItems - If true, will also delete order items referencing seed products.
   *                          If false, will only delete cart items (default: false)
   *                          Note: Setting to true will break order history for seed products
   */
  async cleanupSeedData(deleteOrderItems: boolean = false) {
    this.logger.log('Starting cleanup of seed data...');

    try {
      // Get all seed slugs
      const categorySlugs = categorySeedData.map((c) => c.slug);
      const subCategorySlugs = subCategorySeedData.map((sc) => sc.slug);
      const productSlugs = productSeedData.map((p) => p.slug);

      // Find all seed products
      const seedProducts = await this.productRepository.find({
        where: { slug: In(productSlugs) },
      });

      const productIds = seedProducts.map((p) => p.id);

      if (productIds.length === 0) {
        this.logger.log('No seed products found to delete');
        return {
          message: 'No seed data found to delete',
          deleted: {
            cartItems: 0,
            orderItems: 0,
            products: 0,
            subCategories: 0,
            categories: 0,
          },
        };
      }

      this.logger.log(`Found ${productIds.length} seed products to delete`);

      // Step 1: Delete cart items that reference seed products
      const cartItemsResult = await this.cartItemRepository.delete({
        product_id: In(productIds),
      });
      const deletedCartItems = cartItemsResult.affected || 0;
      this.logger.log(`Deleted ${deletedCartItems} cart items`);

      // Step 2: Optionally delete order items that reference seed products
      let deletedOrderItems = 0;
      if (deleteOrderItems) {
        const orderItemsResult = await this.orderItemRepository.delete({
          product_id: In(productIds),
        });
        deletedOrderItems = orderItemsResult.affected || 0;
        this.logger.log(`Deleted ${deletedOrderItems} order items`);
      } else {
        this.logger.log(
          'Skipping order items deletion (preserving order history). Set deleteOrderItems=true to delete them.',
        );
      }

      // Step 3: Delete seed products
      const productsResult = await this.productRepository.delete({
        slug: In(productSlugs),
      });
      const deletedProducts = productsResult.affected || 0;
      this.logger.log(`Deleted ${deletedProducts} products`);

      // Step 4: Delete seed sub-categories
      const subCategoriesResult = await this.subCategoryRepository.delete({
        slug: In(subCategorySlugs),
      });
      const deletedSubCategories = subCategoriesResult.affected || 0;
      this.logger.log(`Deleted ${deletedSubCategories} sub-categories`);

      // Step 5: Delete seed categories
      const categoriesResult = await this.categoryRepository.delete({
        slug: In(categorySlugs),
      });
      const deletedCategories = categoriesResult.affected || 0;
      this.logger.log(`Deleted ${deletedCategories} categories`);

      this.logger.log('Cleanup completed successfully!');

      return {
        message: 'Seed data cleaned up successfully',
        deleted: {
          cartItems: deletedCartItems,
          orderItems: deletedOrderItems,
          products: deletedProducts,
          subCategories: deletedSubCategories,
          categories: deletedCategories,
        },
        preserved: {
          users: 'All user accounts preserved',
          carts: 'Cart structures preserved (items referencing seed products removed)',
          orders: deleteOrderItems
            ? 'Order items referencing seed products were deleted'
            : 'Order history preserved (order items referencing seed products kept)',
        },
      };
    } catch (error) {
      this.logger.error('Error during cleanup process:', error);
      throw error;
    }
  }
}

