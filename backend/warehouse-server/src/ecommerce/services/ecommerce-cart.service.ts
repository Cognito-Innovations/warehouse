import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EcommerceProduct } from '../entities/ecommerce-product.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AddToCartDto } from '../dto/cart/add-to-cart.dto';
import { UpdateCartItemDto } from '../dto/cart/update-cart-item.dto';
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
    if (!currency || currency === DEFAULT_CURRENCY.code) {
      return 1;
    }
    const result =
      await this.userPreferencesService.getFormattedConvertedPriceByCurrency(
        currency,
        1,
      );
    return typeof result === 'number' ? result : Number(result.price);
  }

  //TODO P0: Add try catch block here
  async setSelectedDeliveryOption(
    userId: string,
    option: DeliveryOption,
    currencyCode: string,
  ): Promise<void> {
    if (!currencyCode) {
      throw new BadRequestException('Currency code is required');
    }
    const exchangeRate = await this.getExchangeRate(currencyCode);

    const totalAmountInUsd = (
      Number(option.total_amount) / Number(exchangeRate)
    ).toFixed(2);

    //TODO P0: Here we are using createQueryBuilder to insert the data into the database. We should use the repository to insert the data.
    //Because of that, it might not able to pickit up the created_at and updated_at values.
    await this.deliverySelectionRepository
      .createQueryBuilder()
      .insert()
      .into(EcommerceUserDeliverySelection)
      .values({
        user_id: userId,
        delivery_platform: option.delivery_platform,
        total_amount: Number(totalAmountInUsd),
        estimated_time: option.estimated_time,
        description: option.description,
        created_at: Math.floor(Date.now() / 1000),
        updated_at: Math.floor(Date.now() / 1000),
      })
      .onConflict(
        `
        ("user_id")
        DO UPDATE SET
          delivery_platform = EXCLUDED.delivery_platform,
          total_amount = EXCLUDED.total_amount,
          estimated_time = EXCLUDED.estimated_time,
          description = EXCLUDED.description
        `,
      )
      .execute();
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
    //TODO P0: Are you checking is it presiable or not ?
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
    //TODO P0: Here also you need to verify all products are related to one category like perisable or other catgeory 
    const itemsFromDb = await this.userItemRepository.find({
      where: { user_id: userId, status: UserProductStatus.CART },
    });

    const preparedItems = await Promise.all(
      (itemsFromDb ?? []).map(async (item) => {
        const product = await this.productRepository.findOne({
          where: { id: item.product_id },
          relations: ['category', 'measurement'],
        });
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

    //TODO P0: Pull from the cache manager directly by passing key
    const selectedDelivery = await this.deliverySelectionRepository.findOne({
      where: { user_id: userId },
    });

    const itemsFromDb = await this.userItemRepository.find({
      where: {
        user_id: userId,
        status: UserProductStatus.CART,
        product_id: In(productIds),
      },
    });

    const preparedItems = await Promise.all(
      (itemsFromDb ?? []).map(async (item) => {
        const product = await this.productRepository.findOne({
          where: { id: item.product_id },
          relations: ['category', 'measurement'],
        });

        const price = Number(product?.price ?? 0); //TODO P0: It can't be 0, if it 0, then throw error

        const weightPerUnit = this.deliveryFeeService.getWeightInKg(
          Number(product?.unit_value ?? 0), //TODO P0: It can't be 0, if it 0, then throw error
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

    const items: ComputedCartItem[] = preparedItems.map((data) => {
      const { item, product, price } = data;

      return {
        id: item.id,
        cart_id: userId,
        product_id: item.product_id,
        quantity: item.quantity,
        product: product ?? null,
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

      const cargoLabel =
        product.cargo_option?.label?.toLowerCase() ?? 'general'; //TODO P0: If product is not belongs to any category, don't allow, remove that product
      //there wont be any default 'general' writing manually

      const weightPerUnit = this.deliveryFeeService.getWeightInKg(
        Number(product?.unit_value ?? 0),
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
      countryCode!,
      currencyCode!,
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
