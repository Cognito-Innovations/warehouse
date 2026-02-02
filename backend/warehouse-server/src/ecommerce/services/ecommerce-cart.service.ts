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
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';
import { DEFAULT_CURRENCY } from '../../shared/constants.js';
import {
  DeliveryFeeService,
  DeliveryOption,
} from 'src/shared/get-delivery-fee.service';
import {
  EcommerceUserProductStatus,
  UserProductStatus,
} from '../entities/ecommerce_user_products_status.entity';
import { EcommerceUserDeliverySelection } from '../entities/ecommerce_user_delivery_selections.entity';

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
  total_discount?: number;
}

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(EcommerceUserProductStatus)
    private readonly cartRepository: Repository<EcommerceUserProductStatus>,
    @InjectRepository(EcommerceProduct)
    private readonly productRepository: Repository<EcommerceProduct>,
    @InjectRepository(EcommerceUserDeliverySelection)
    private readonly deliverySelectionRepository: Repository<EcommerceUserDeliverySelection>,
    private readonly userPreferencesService: UserPreferencesService,
    private readonly deliveryFeeService: DeliveryFeeService,
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
  ): Promise<void> {
    try {
      if (!option?.delivery_platform || !option?.total_amount || !userId) {
        throw new BadRequestException(
          'Delivery platform, total amount, or user id is required',
        );
      }

      const { currencyCode } =
        await this.userPreferencesService.getUserPreferenceCurrencyAndCountry(
          userId,
        );
      if (!currencyCode) {
        throw new BadRequestException('Currency code not found');
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

      throw new InternalServerErrorException((error as Error).message);
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

  async syncLocalStorageProductsToCart(
    userId: string,
    products: { product_id: string; quantity: number }[],
  ): Promise<ComputedCart> {
    let cartItems = await this.cartRepository.find({
      where: {
        user_id: userId,
        product_id: In(products.map((product) => product.product_id)),
      },
    });
    if (cartItems.length === 0) cartItems = [];
    for (const product of products) {
      const cartItem = cartItems.find(
        (cartItem) => cartItem.product_id === product.product_id,
      );
      if (cartItem) {
        cartItem.quantity = product.quantity;
        await this.cartRepository.save(cartItem);
      } else {
        const newCartItem = this.cartRepository.create({
          user_id: userId,
          product_id: product.product_id,
          quantity: product.quantity,
          status: UserProductStatus.CART,
        });
        cartItems.push(newCartItem);
      }
    }
    await this.cartRepository.save(cartItems);
    return this.getCart(userId);
  }

  async addToCart(
    userId: string,
    addToCartDto: AddToCartDto,
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
    });

    // Check if product is already in cart
    const existingItem = await this.cartRepository.findOne({
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
      await this.cartRepository.save(existingItem);
    } else {
      // Add new item
      const cartItem = this.cartRepository.create({
        user_id: userId,
        product_id,
        quantity,
        status: UserProductStatus.CART,
      });

      await this.cartRepository.save(cartItem);
    }

    return this.getCart(userId);
  }

  async removeFromCart(userId: string, itemId: string): Promise<ComputedCart> {
    const cartItem = await this.cartRepository.findOne({
      where: { id: itemId, user_id: userId, status: UserProductStatus.CART },
    });

    if (cartItem && cartItem.quantity > 1) {
      cartItem.quantity = cartItem.quantity - 1;
      await this.cartRepository.save(cartItem);
    } else if (cartItem) {
      await this.cartRepository.remove(cartItem);
    }

    return this.getCart(userId);
  }

  async removeEntireProductFromCart(
    userId: string,
    itemId: string,
  ): Promise<ComputedCart> {
    const cartItem = await this.cartRepository.findOne({
      where: {
        product_id: itemId,
        user_id: userId,
        status: UserProductStatus.CART,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartRepository.remove(cartItem);

    return this.getCart(userId);
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartRepository.delete({
      user_id: userId,
      status: UserProductStatus.CART,
    });
  }

  async getCart(userId: string): Promise<ComputedCart> {
    const itemsFromDb = await this.cartRepository.find({
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

    const { currencyCode, countryCode } =
      await this.userPreferencesService.getUserPreferenceCurrencyAndCountry(
        userId,
      );
    if (!currencyCode || !countryCode) {
      throw new BadRequestException('Currency code or country code not found');
    }
    const items: ComputedCartItem[] = await Promise.all(
      preparedItems.map(async (data) => {
        const { item, product, price, itemWeight } = data;

        const delivery_fee = await this.deliveryFeeService.getDeliveryFee(
          itemWeight,
          countryCode,
          currencyCode,
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
    return this.applyCurrencyConversion(computedCart, currencyCode);
  }

  async getCartGroupedByCargo(userId: string): Promise<{
    items: Record<string, ComputedCartItem[]>;
    total_amount: number;
    final_amount: number;
    total_delivery_fee?: number;
  }> {
    const cart = await this.getCart(userId);

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
  ): Promise<ComputedCart> {
    if (!productIds || productIds.length === 0) {
      return {
        items: [],
        total_amount: 0,
        final_amount: 0,
        total_delivery_fee: 0,
      };
    }

    const cartItems = await this.cartRepository.find({
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
      relations: ['category', 'measurement'],
    });

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    let totalWeight = 0;
    let totalDiscount = 0;

    const preparedItems = cartItems.map((item) => {
      const product = productMap.get(item.product_id);

      if (!product) {
        throw new BadRequestException('Product not found');
      }

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

      const discountPercentage = Number(product.discount_percentage) || 0;
      const discountAmountPerUnit = price * (discountPercentage / 100);
      const totalItemDiscount = discountAmountPerUnit * allowedQuantity;

      totalDiscount += totalItemDiscount;

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
        discountPercentage,
        totalItemDiscount,
      };
    });

    const { currencyCode, countryCode } =
      await this.userPreferencesService.getUserPreferenceCurrencyAndCountry(
        userId,
      );
    if (!currencyCode || !countryCode) {
      throw new BadRequestException('Currency code or country code not found');
    }

    const normalizedCountry = countryCode?.toUpperCase();

    let totalDeliveryFee = 0;
    try {
      totalDeliveryFee = await this.deliveryFeeService.getDeliveryFee(
        totalWeight,
        normalizedCountry,
        currencyCode,
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

    const finalAmount = totalAmount - totalDiscount + totalDeliveryFee;

    const computedCart: ComputedCart = {
      items,
      total_amount: totalAmount,
      final_amount: Math.max(0, finalAmount),
      total_delivery_fee: totalDeliveryFee,
      total_discount: totalDiscount,
    };

    return this.applyCurrencyConversion(computedCart, currencyCode);
  }

  async getDeliveryRates(
    userId: string,
    productIds: string[],
  ): Promise<DeliveryOption[]> {
    if (!productIds || productIds.length === 0) {
      return [];
    }

    const cartItems = await this.cartRepository.find({
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
      relations: ['measurement'],
    });

    let totalWeight = 0;

    for (const item of cartItems) {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) {
        throw new BadRequestException('Product not found');
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

    const { currencyCode, countryCode } =
      await this.userPreferencesService.getUserPreferenceCurrencyAndCountry(
        userId,
      );
    if (!currencyCode || !countryCode) {
      throw new BadRequestException('Currency code or country code not found');
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
