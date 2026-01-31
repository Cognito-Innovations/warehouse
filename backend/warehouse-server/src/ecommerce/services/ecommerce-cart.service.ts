import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EcommerceProduct } from '../entities/ecommerce-product.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddToCartDto } from '../dto/cart/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/cart/update-cart-item.dto';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';
import {
  DEFAULT_COUNTRY_CODE,
  DEFAULT_CURRENCY,
} from '../../shared/constants.js';
import {
  DeliveryFeeService,
  DeliveryOption,
} from 'src/shared/get-delivery-fee.service';
import {
  EcommerceUserProductStatus,
  UserProductStatus,
} from '../entities/ecommerce_user_products_status.entity';
import { EcommerceUserDeliverySelection } from '../entities/ecommerce_user_delivery_selections.entity';
import { CacheManagerService } from 'src/shared/cache-manager.service';

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
}

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(EcommerceUserProductStatus)
    private readonly userItemRepository: Repository<EcommerceUserProductStatus>,
    @InjectRepository(EcommerceProduct)
    private readonly productRepository: Repository<EcommerceProduct>,
    @InjectRepository(EcommerceUserDeliverySelection)
    private readonly deliverySelectionRepository: Repository<EcommerceUserDeliverySelection>,
    private readonly userPreferencesService: UserPreferencesService,
    private readonly deliveryFeeService: DeliveryFeeService,
    private readonly cacheManagerService: CacheManagerService,
  ) {}

  private validateProductAndStock(
    product: EcommerceProduct | null,
    requestedQuantity: number,
    existingQuantity = 0,
  ) {
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (!product.is_active) {
      throw new BadRequestException('This product is currently unavailable');
    }

    const totalRequested = existingQuantity + requestedQuantity;

    if (totalRequested > product.stock_quantity) {
      if (existingQuantity > 0) {
        throw new BadRequestException(
          `Only ${product.stock_quantity} item(s) available in stock. You already have ${existingQuantity} in your cart.`,
        );
      }

      throw new BadRequestException(
        `Only ${product.stock_quantity} item(s) available in stock.`,
      );
    }
  }

  private async getExchangeRate(currency: string): Promise<number> {
    if (currency === DEFAULT_CURRENCY.code) {
      return DEFAULT_CURRENCY.rate;
    }

    const result =
      (await this.userPreferencesService.getFormattedConvertedPriceByCurrency(
        currency,
        DEFAULT_CURRENCY.rate,
      )) as { price: string | number };

    const rate = Number(result?.price);

    if (!rate || Number.isNaN(rate)) {
      throw new BadRequestException('Failed to get exchange rate');
    }

    return rate;
  }

  private normalizeToBaseCurrency(
    amount: number,
    exchangeRate: number,
  ): number {
    if (!exchangeRate || exchangeRate === 0) {
      throw new BadRequestException(
        'Invalid exchange rate for currency conversion',
      );
    }

    return Number((amount / exchangeRate).toFixed(2));
  }

  async setSelectedDeliveryOption(
    userId: string,
    option: DeliveryOption,
    currencyCode: string,
  ): Promise<void> {
    try {
      if (
        !currencyCode ||
        !option?.delivery_platform ||
        !option?.total_amount ||
        !userId
      ) {
        throw new BadRequestException(
          'Currency code, delivery platform, total amount, or user id is required',
        );
      }
      const exchangeRate = await this.getExchangeRate(currencyCode);

      const totalAmountInUsd = this.normalizeToBaseCurrency(
        Number(option.total_amount),
        Number(exchangeRate),
      );

      const now = Math.floor(Date.now() / 1000);

      await this.deliverySelectionRepository.upsert(
        {
          user_id: userId,
          delivery_platform: option.delivery_platform,
          total_amount: totalAmountInUsd,
          estimated_time: option.estimated_time,
          description: option.description,
          created_at: now,
          updated_at: now,
        },
        {
          conflictPaths: ['user_id'],
        },
      );
    } catch (error) {
      console.error('setSelectedDeliveryOption error:', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  async getSelectedDeliveryOption(
    userId: string,
  ): Promise<DeliveryOption | null> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const selection = await this.deliverySelectionRepository.findOne({
        where: { user_id: userId },
      });
      if (!selection) return null;
      return {
        delivery_platform: selection.delivery_platform,
        total_amount: selection.total_amount,
        estimated_time: selection.estimated_time,
        description: selection.description,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to get selected delivery option',
      );
    }
  }

  async clearSelectedDeliveryOption(userId: string): Promise<void> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }
      await this.deliverySelectionRepository.delete({ user_id: userId });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to clear selected delivery option',
      );
    }
  }

  async addToCart(
    userId: string,
    addToCartDto: AddToCartDto,
    currency?: string,
    countryCode?: string,
  ): Promise<ComputedCart> {
    const { product_id, quantity } = addToCartDto;

    if (!userId || !product_id || !quantity) {
      throw new BadRequestException(
        'User ID, product ID, and quantity are required',
      );
    }

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { id: product_id },
      select: ['id', 'price', 'stock_quantity', 'is_active'],
    });

    // Check if product is already in cart
    let existingItem = await this.userItemRepository.findOne({
      where: { user_id: userId, product_id, status: UserProductStatus.CART },
    });

    const existingQuantity = existingItem?.quantity ?? 0;
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    this.validateProductAndStock(product, quantity, existingQuantity);

    if (existingItem) {
      // Update quantity
      existingItem.quantity = existingQuantity + quantity;
      await this.userItemRepository.save(existingItem);
    } else {
      // Add new item
      const cartItem = this.userItemRepository.create({
        user_id: userId,
        product_id,
        quantity,
        status: UserProductStatus.CART,
      });

      await this.userItemRepository.save(cartItem);
    }

    return this.getCart(userId, currency, countryCode);
  }

  async updateCartItem(
    userId: string,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
    currency?: string,
    countryCode?: string,
  ): Promise<ComputedCart> {
    const { quantity } = updateCartItemDto;

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const cartItem = await this.userItemRepository.findOne({
      where: { id: itemId, user_id: userId, status: UserProductStatus.CART },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found or cannot be updated');
    }

    const product = await this.productRepository.findOne({
      where: { id: cartItem.product_id },
      relations: ['cargo_option'],
    });

    this.validateProductAndStock(product, quantity);

    cartItem.quantity = quantity;

    await this.userItemRepository.save(cartItem);

    return this.getCart(userId, currency, countryCode);
  }

  async removeFromCart(
    userId: string,
    itemId: string,
    currency?: string,
    countryCode?: string,
  ): Promise<ComputedCart> {
    const cartItem = await this.userItemRepository.findOne({
      where: { id: itemId, user_id: userId, status: UserProductStatus.CART },
    });

    // If item doesn't exist, it might have been already deleted (idempotent operation)
    if (cartItem) {
      await this.userItemRepository.remove(cartItem);
    }

    return this.getCart(userId, currency, countryCode);
  }

  async clearCart(userId: string): Promise<void> {
    await this.userItemRepository.delete({
      user_id: userId,
      status: UserProductStatus.CART,
    });
  }

  async getCart(
    userId: string,
    currency?: string,
    countryCode?: string,
  ): Promise<ComputedCart & { currency?: string }> {
    const itemsFromDb = await this.userItemRepository.find({
      where: { user_id: userId, status: UserProductStatus.CART },
    });

    const productIds = itemsFromDb.map((item) => item.product_id);

    const products = await this.productRepository.find({
      where: { id: In(productIds) },
      relations: ['category', 'measurement', 'cargo_option'],
    });

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    const preparedItems = itemsFromDb.map((item) => {
      const product = productMap.get(item.product_id);
      if (!product) {
        throw new BadRequestException('Product not found');
      }

      const price = Number(product?.price ?? 0);
      const weightPerUnit = this.deliveryFeeService.getWeightInKg(
        Number(product?.unit_value ?? 0),
        product?.measurement?.label ?? 'kg',
      );
      const itemWeight = weightPerUnit * item.quantity;

      return {
        item,
        product,
        price,
        itemWeight,
      };
    });

    const items: ComputedCartItem[] = await Promise.all(
      preparedItems.map(async (data) => {
        const { item, product, price, itemWeight } = data;

        const delivery_fee = await this.deliveryFeeService.getDeliveryFee(
          itemWeight,
          countryCode!,
          currency!,
        );

        return {
          id: item.id,
          cart_id: userId,
          product_id: item.product_id,
          quantity: item.quantity,
          product: product ?? null,
          unit_price: price,
          total_price: price * item.quantity,
          delivery_fee,
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      }),
    );

    const totalAmount = items.reduce((sum, it) => sum + it.total_price, 0);
    const totalDeliveryFee = items.reduce(
      (sum, it) => sum + it.delivery_fee,
      0,
    );
    const finalAmount = totalAmount + totalDeliveryFee;

    const computedCart: ComputedCart = {
      items,
      total_amount: totalAmount,
      final_amount: finalAmount,
      total_delivery_fee: totalDeliveryFee,
    };

    return this.applyCurrencyConversion(
      computedCart,
      currency ?? DEFAULT_CURRENCY.code,
    );
  }

  async getCartGroupedByCargo(
    userId: string,
    currency?: string,
    countryCode?: string,
  ): Promise<{
    items: Record<string, ComputedCartItem[]>;
    total_amount: number;
    final_amount: number;
    total_delivery_fee?: number;
  }> {
    const cart = await this.getCart(userId, currency, countryCode);

    const groupedItems: Record<string, ComputedCartItem[]> = {};

    for (const item of cart.items) {
      const cargoLabel = item.product?.cargo_option?.label?.toLowerCase();

      if (!cargoLabel) {
        throw new BadRequestException(
          'Product does not have a valid cargo option',
        );
      }

      if (!groupedItems[cargoLabel]) {
        groupedItems[cargoLabel] = [];
      }

      groupedItems[cargoLabel].push(item);
    }

    return {
      items: groupedItems,
      total_amount: cart.total_amount,
      final_amount: cart.final_amount,
      total_delivery_fee: cart.total_delivery_fee,
    };
  }

  async getCheckoutData(
    userId: string,
    productIds: string[],
    currency?: string,
    countryCode?: string,
  ): Promise<ComputedCart> {
    if (!productIds || productIds.length === 0) {
      return {
        items: [],
        total_amount: 0,
        final_amount: 0,
        total_delivery_fee: 0,
      };
    }

    const cartItems = await this.userItemRepository.find({
      where: {
        user_id: userId,
        status: UserProductStatus.CART,
        product_id: In(productIds),
      },
    });

    if (!cartItems.length) {
      throw new BadRequestException('No valid cart items found');
    }

    const products = await this.productRepository.find({
      where: { id: In(cartItems.map((item) => item.product_id)) },
      relations: ['category', 'measurement', 'cargo_option'],
    });

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    const cargoSet = new Set<string>();
    let totalWeight = 0;

    const preparedItems = cartItems.map((item) => {
      const product = productMap.get(item.product_id);

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      const cargo = product.cargo_option?.label?.toLowerCase();
      if (!cargo) {
        throw new BadRequestException(
          'Product does not belong to a valid category',
        );
      }
      cargoSet.add(cargo);

      if (product.stock_quantity <= 0) {
        throw new BadRequestException(
          `Product ${product.id} is not available in stock`,
        );
      }

      const allowedQuantity = Math.min(item.quantity, product.stock_quantity);

      const price = Number(product.price);
      if (!price || price <= 0) {
        throw new BadRequestException(
          `Invalid price for product ${product.id}`,
        );
      }

      const unitValue = Number(product.unit_value);
      if (!unitValue || unitValue <= 0) {
        throw new BadRequestException(
          `Invalid unit value for product ${product.id}`,
        );
      }

      const weightPerUnit = this.deliveryFeeService.getWeightInKg(
        unitValue,
        product.measurement?.label ?? 'kg',
      );
      const itemWeight = weightPerUnit * allowedQuantity;
      totalWeight += itemWeight;

      return {
        item,
        product,
        quantity: allowedQuantity,
        requestedQuantity: item.quantity,
        price,
        itemWeight,
      };
    });

    if (cargoSet.size > 1) {
      throw new BadRequestException(
        'All items must belong to the same cargo category',
      );
    }

    const normalizedCountry =
      countryCode?.toUpperCase() || DEFAULT_COUNTRY_CODE;

    let totalDeliveryFee = 0;
    try {
      totalDeliveryFee = await this.deliveryFeeService.getDeliveryFee(
        totalWeight,
        normalizedCountry,
        DEFAULT_CURRENCY.code,
      );
    } catch (error) {
      console.warn('Failed to calculate delivery fee for checkout', error);
      totalDeliveryFee = 0;
    }

    const items: ComputedCartItem[] = preparedItems.map((data) => ({
      id: data.item.id,
      cart_id: userId,
      product_id: data.item.product_id,
      quantity: data.quantity,
      requested_quantity: data.requestedQuantity,
      product: data.product,
      unit_price: data.price,
      total_price: data.price * data.quantity,
      delivery_fee: 0,
      created_at: data.item.created_at,
      updated_at: data.item.updated_at,
    }));

    const totalAmount = items.reduce((sum, it) => sum + it.total_price, 0);

    const finalAmount = totalAmount + totalDeliveryFee;

    const computedCart: ComputedCart = {
      items,
      total_amount: totalAmount,
      final_amount: finalAmount,
      total_delivery_fee: totalDeliveryFee,
    };

    return this.applyCurrencyConversion(
      computedCart,
      currency ?? DEFAULT_CURRENCY.code,
    );
  }

  async getDeliveryRates(
    userId: string,
    productIds: string[],
    countryCode?: string,
    currencyCode?: string,
  ): Promise<DeliveryOption[]> {
    if (!productIds || productIds.length === 0) {
      return [];
    }

    const cartItems = await this.userItemRepository.find({
      where: {
        user_id: userId,
        status: UserProductStatus.CART,
        product_id: In(productIds),
      },
    });
    if (!cartItems.length) {
      return [];
    }

    const products = await this.productRepository.find({
      where: { id: In(productIds) },
      relations: ['measurement', 'cargo_option'],
    });

    const cargoSet = new Set<string>();
    let totalWeight = 0;

    for (const item of cartItems) {
      const product = products.find(p => p.id === item.product_id);
      if (!product) {
        throw new BadRequestException('Product not found');
      }

      const cargoLabel = product.cargo_option?.label?.toLowerCase();
      if (!cargoLabel) {
        throw new BadRequestException(
          `Product ${product.id} does not have a valid cargo option`,
        );
      }

      cargoSet.add(cargoLabel);

      if (cargoSet.size > 1) {
        throw new BadRequestException(
          'Selected products belong to different cargo types',
        );
      }

      const unitValue = Number(product.unit_value);
      if (!unitValue || unitValue <= 0) {
        throw new BadRequestException(
          `Invalid unit value for product ${product.id}`,
        );
      }

      const weightPerUnit = this.deliveryFeeService.getWeightInKg(
        unitValue,
        product.measurement?.label ?? 'kg',
      );

      totalWeight += weightPerUnit * item.quantity;
    }

    if (totalWeight <= 0) {
      return [];
    }

    return this.deliveryFeeService.getDeliveryOptions(
      totalWeight,
      countryCode,
      currencyCode,
    );
  }

  private async applyCurrencyConversion(
    cart: ComputedCart,
    currency: string,
  ): Promise<ComputedCart> {
    const convert = async (price: number): Promise<number> => {
      const result =
        await this.userPreferencesService.getFormattedConvertedPriceByCurrency(
          currency,
          price,
        );
      return typeof result === 'number' ? result : Number(result.price);
    };

    const convertedItems = await Promise.all(
      cart.items.map(async (item) => {
        let product = item.product;
        if (product) {
          product = Object.assign(product, {
            price: await convert(Number(product.price)),
          });
        }

        return {
          ...item,
          unit_price: await convert(item.unit_price),
          total_price: await convert(item.total_price),
          delivery_fee: await convert(item.delivery_fee ?? 0),
          product,
        } as ComputedCartItem;
      }),
    );

    return {
      ...cart,
      total_amount: await convert(cart.total_amount),
      final_amount: await convert(cart.final_amount),
      total_delivery_fee: await convert(cart.total_delivery_fee ?? 0),
      items: convertedItems,
    };
  }
}
