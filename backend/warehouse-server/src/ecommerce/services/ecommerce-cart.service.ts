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
  CACHE_KEY,
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

  private async getExistingCartCargo(userId: string): Promise<string | null> {
    const items = await this.userItemRepository.find({
      where: { user_id: userId, status: UserProductStatus.CART },
    });

    if (!items.length) return null;

    const product = await this.productRepository.findOne({
      where: { id: items[0].product_id },
      relations: ['cargo_option'],
    });

    return product?.cargo_option?.label?.toLowerCase() ?? null;
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

      //TODO P0: If we are using in many places, keep it in a separate function and resuse it
      const totalAmountInUsd = (
        Number(option.total_amount) / Number(exchangeRate)
      ).toFixed(2);

      await this.deliverySelectionRepository.upsert(
        {
          user_id: userId,
          delivery_platform: option.delivery_platform,
          total_amount: Number(totalAmountInUsd),
          estimated_time: option.estimated_time,
          description: option.description,
        },
        {
          conflictPaths: ['user_id'],
        },
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Failed to set selected delivery option',
      );
    }
  }

  async getSelectedDeliveryOption(
    userId: string,
  ): Promise<DeliveryOption | null> {
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
  }

  async clearSelectedDeliveryOption(userId: string): Promise<void> {
    await this.deliverySelectionRepository.delete({ user_id: userId });
  }

  async addToCart(
    userId: string,
    addToCartDto: AddToCartDto,
    currency?: string,
    countryCode?: string,
  ): Promise<ComputedCart> {
    const { product_id, quantity } = addToCartDto;

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    // Check if product exists
    const product = await this.productRepository.findOne({
      where: { id: product_id },
      select: ['id', 'price', 'stock_quantity', 'is_active'],
    });

    // Check if product is already in cart
    const existingItem = await this.userItemRepository.findOne({
      where: { user_id: userId, product_id, status: UserProductStatus.CART },
    });

    const existingQuantity = existingItem?.quantity ?? 0;
    this.validateProductAndStock(product, quantity, existingQuantity);

    const existingCargo = await this.getExistingCartCargo(userId);

    if (existingCargo) {
      const incomingProduct = await this.productRepository.findOne({
        where: { id: product_id },
        relations: ['cargo_option'],
      });

      const incomingCargo =
        incomingProduct?.cargo_option?.label?.toLowerCase() ?? null;

      if (incomingCargo && incomingCargo !== existingCargo) {
        await this.clearCart(userId);
      }
    }

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

    const existingCargo = await this.getExistingCartCargo(userId);
    const currentCargo = product?.cargo_option?.label?.toLowerCase() ?? null;

    if (existingCargo && currentCargo && existingCargo !== currentCargo) {
      throw new BadRequestException(
        'All items in the cart must belong to the same category',
      );
    }

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

    const cargoSet = new Set<string>();

    const preparedItems = await Promise.all(
      (itemsFromDb ?? []).map(async (item) => {
        const product = await this.productRepository.findOne({
          where: { id: item.product_id },
          relations: ['category', 'measurement', 'cargo_option'],
        });

        const cargo = product?.cargo_option?.label?.toLowerCase() ?? null;

        if (!cargo) {
          throw new BadRequestException(
            'Product does not belong to a valid category',
          );
        }

        cargoSet.add(cargo);

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
      }),
    );

    if (cargoSet.size > 1) {
      throw new BadRequestException(
        'All items in the cart must belong to the same category',
      );
    }

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

    const itemsFromDb = await this.userItemRepository.find({
      where: {
        user_id: userId,
        status: UserProductStatus.CART,
        product_id: In(productIds),
      },
    });

    let totalWeight = 0;

    const preparedItems = await Promise.all(
      (itemsFromDb ?? []).map(async (item) => {
        const product = await this.productRepository.findOne({
          where: { id: item.product_id },
          relations: ['category', 'measurement'],
        });

        if (!product) {
          throw new BadRequestException('Product not found');
        }

        const price = Number(product?.price);
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
          product?.measurement?.label ?? 'kg',
        );
        const itemWeight = weightPerUnit * item.quantity;
        totalWeight += itemWeight;

        return {
          item,
          product,
          price,
          itemWeight,
        };
      }),
    );

    const normalizedCountry =
      countryCode?.toUpperCase() || DEFAULT_COUNTRY_CODE;

    const cacheKey = `${CACHE_KEY.DELIVERY}:${normalizedCountry}:${totalWeight}`;

    const cachedDeliveryOptions =
      await this.cacheManagerService.get<DeliveryOption[]>(cacheKey);

    const selectedDelivery = cachedDeliveryOptions?.[0];

    const items: ComputedCartItem[] = preparedItems.map((data) => {
      const { item, product, price } = data;

      return {
        id: item.id,
        cart_id: userId,
        product_id: item.product_id,
        quantity: item.quantity,
        product,
        unit_price: price,
        total_price: price * item.quantity,
        delivery_fee: 0,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
    });

    const totalAmount = items.reduce((sum, it) => sum + it.total_price, 0);

    const totalDeliveryFee = selectedDelivery
      ? Number(selectedDelivery.total_amount)
      : 0;

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
    countryCode?: string,
    currencyCode?: string,
  ): Promise<DeliveryOption[]> {
    const items = await this.userItemRepository.find({
      where: { user_id: userId, status: UserProductStatus.CART },
    });
    if (!items || items.length === 0) {
      return [];
    }

    const cargoWeightMap = new Map<string, number>();

    for (const item of items) {
      const product = await this.productRepository.findOne({
        where: { id: item.product_id },
        relations: ['measurement', 'cargo_option'],
      });
      if (!product) continue;

      const cargoLabel = product.cargo_option?.label?.toLowerCase();
      if (!cargoLabel) continue;

      const unitValue = Number(product.unit_value);
      if (!unitValue || unitValue <= 0) {
        throw new BadRequestException(
          `Invalid unit value for product ${product.id}`,
        );
      }

      const weightPerUnit = this.deliveryFeeService.getWeightInKg(
        unitValue,
        product?.measurement?.label ?? 'kg',
      );

      const totalWeight = weightPerUnit * item.quantity;

      cargoWeightMap.set(
        cargoLabel,
        (cargoWeightMap.get(cargoLabel) ?? 0) + totalWeight,
      );
    }

    // Only ONE cargo type should exist
    const [[_, totalWeight]] = [...cargoWeightMap.entries()];

    if (!totalWeight || totalWeight <= 0) {
      return [];
    }

    return await this.deliveryFeeService.getDeliveryOptions(
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
