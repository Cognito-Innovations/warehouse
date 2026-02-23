import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './ecommerce-order.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {
  EcommercePayment,
  Status,
} from '../entities/ecommerce-payments.entity';
import {
  EcommerceUserProductStatus,
  UserProductStatus,
} from '../entities/ecommerce_user_products_status.entity';
import { EcommerceProduct } from '../entities/ecommerce-product.entity';
import { EcommerceOrderReference } from '../entities/ecommerce-order-references.entity';
import { EcommerceUserDeliverySelection } from '../entities/ecommerce_user_delivery_selections.entity';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';
import { PaymentService } from './payment.service';
import { CartService } from './ecommerce-cart.service';
import {
  mockRepository,
  mockUserPreferencesService,
  mockPaymentService,
  mockCartService,
  mockDataSource,
  mockQueryRunnerFactory,
} from './ecommerce-order.service.mocks';

describe('OrderService', () => {
  let service: OrderService;
  let userItemRepository: Repository<EcommerceUserProductStatus>;
  let paymentRepository: Repository<EcommercePayment>;
  let orderReferenceRepository: Repository<EcommerceOrderReference>;
  let productRepository: Repository<EcommerceProduct>;
  let deliverySelectionRepository: Repository<EcommerceUserDeliverySelection>;
  let userPreferencesService: UserPreferencesService;
  let paymentService: PaymentService;
  let cartService: CartService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(EcommercePayment),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(EcommerceOrderReference),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(EcommerceUserProductStatus),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(EcommerceProduct),
          useFactory: mockRepository,
        },
        {
          provide: getRepositoryToken(EcommerceUserDeliverySelection),
          useFactory: mockRepository,
        },
        {
          provide: UserPreferencesService,
          useValue: mockUserPreferencesService,
        },
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
        {
          provide: CartService,
          useValue: mockCartService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    userItemRepository = module.get(
      getRepositoryToken(EcommerceUserProductStatus),
    );

    paymentRepository = module.get(getRepositoryToken(EcommercePayment));
    orderReferenceRepository = module.get(
      getRepositoryToken(EcommerceOrderReference),
    );

    productRepository = module.get(getRepositoryToken(EcommerceProduct));
    deliverySelectionRepository = module.get(
      getRepositoryToken(EcommerceUserDeliverySelection),
    );

    paymentService = module.get(PaymentService);
    userPreferencesService = module.get(UserPreferencesService);
    cartService = module.get(CartService);
    dataSource = module.get(DataSource);
    paymentRepository.create.mockImplementation((dto) => ({
      ...dto, id: 'payment1',
    }));
    orderReferenceRepository.create.mockImplementation((dto) => ({ ...dto }));
  });

  describe('roundCurrency', () => {
    it('should round the value to two decimal places', () => {
      expect(service['roundCurrency'](10.123)).toBe(10.12);
      expect(service['roundCurrency'](10.125)).toBe(10.13);
      expect(service['roundCurrency'](10)).toBe(10);
    });
  });

  describe('generateOrderNumber', () => {
    it('should generate an order number in the format ORD-XXXXXX-XXXX', () => {
      const orderNumber = service['generateOrderNumber']();
      expect(orderNumber).toMatch(/^ORD-\d{6}-[A-Z0-9]{4}$/);
    });
  });

  describe('calculateOrderPricing', () => {
    it('should calculate pricing correctly without discount and delivery', () => {
      const items = [
        { product: { price: 100, discount_percentage: 0 }, quantity: 2 } as any,
      ];
      const currencyInfo = { code: 'USD', symbol: '$', rate: 1 };
      const deliveryFeeUSD = 0;
      const result = service['calculateOrderPricing'](
        items,
        currencyInfo,
        deliveryFeeUSD,
      );
      expect(result.finalUSDTotal).toBe(210);
      expect(result.itemDetails).toHaveLength(1);
    });

    it('should calculate pricing correctly with discount and delivery', () => {
      const items = [
        {
          product: { price: 100, discount_percentage: 10 },
          quantity: 2,
        } as any,
      ];
      const currencyInfo = { code: 'USD', symbol: '$', rate: 1 };
      const deliveryFeeUSD = 10;
      const result = service['calculateOrderPricing'](
        items,
        currencyInfo,
        deliveryFeeUSD,
      );
      expect(result.finalUSDTotal).toBe(199.5);
    });
  });

  describe('decreaseProductStock', () => {
    it('should decrease stock for each item', async () => {
      const payment = {
        items: [
          {
            product: { id: 'p1', stock_quantity: 10 },
            user_item: { quantity: 2 },
          },
          {
            product: { id: 'p2', stock_quantity: 5 },
            user_item: { quantity: 3 },
          },
        ],
      } as any;
      await service['decreaseProductStock'](payment);
      expect(payment.items[0].product.stock_quantity).toBe(8);
      expect(payment.items[1].product.stock_quantity).toBe(2);
      expect(productRepository.save).toHaveBeenCalledTimes(2);
    });

    it('should throw BadRequestException if insufficient stock', async () => {
      const payment = {
        items: [
          {
            product: { id: 'p1', stock_quantity: 1 },
            user_item: { quantity: 2 },
          },
        ],
      } as any;
      await expect(service['decreaseProductStock'](payment)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should use provided manager if given', async () => {
      const mockManager = {
        save: jest.fn(),
        findOne: jest.fn().mockResolvedValue({
          id: 'p1',
          stock_quantity: 10,
        }),
      } as any;

      const payment = {
        items: [
          {
            product_id: 'p1',
            user_item: { quantity: 2 },
          },
        ],
      } as any;

      await service['decreaseProductStock'](payment, mockManager);

      expect(mockManager.findOne).toHaveBeenCalled();
      expect(mockManager.save).toHaveBeenCalled();
    });
  });

  describe('createOrder', () => {
    it('should throw BadRequestException when userId is missing', async () => {
      await expect(
        service.createOrder('', { product_ids: [] } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when no cart items are found for the user', async () => {
      jest.spyOn(userItemRepository, 'find').mockResolvedValue([]);
      await expect(
        service.createOrder('user1', { product_ids: ['p1'] } as any),
      ).rejects.toThrow('Cart is empty');
    });

    it('should create order and initiate PayPal session when cart items are valid', async () => {
      const mockProduct = {
        id: 'p1',
        price: 100,
        discount_percentage: 0,
        stock_quantity: 10,
      };
      jest.spyOn(userItemRepository, 'find').mockResolvedValue([
        {
          id: 'item1',
          product_id: 'p1',
          quantity: 2,
          product: mockProduct,
          status: UserProductStatus.CART,
        } as any,
      ]);

      const mockQueryRunner = mockQueryRunnerFactory();
      jest.spyOn(dataSource, 'createQueryRunner').mockReturnValue(mockQueryRunner);
      mockQueryRunner.manager.findOne.mockResolvedValue(mockProduct);
      mockQueryRunner.manager.save.mockResolvedValueOnce({
        id: 'payment1',
      }).mockResolvedValueOnce([]);

      jest
        .spyOn(paymentService, 'createPayPalPaymentSession')
        .mockResolvedValue(undefined);

      jest.spyOn(service, 'findOne').mockResolvedValue({ id: 'order1' } as any);

      const result = await service.createOrder('user1', {
        product_ids: ['p1'],
      } as any);

      expect(result).toBeDefined();
      expect(paymentService.createPayPalPaymentSession).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException when product_ids array is empty', async () => {
      jest
        .spyOn(userItemRepository, 'find')
        .mockResolvedValue([{ product_id: 'p1' } as any]);

      await expect(
        service.createOrder('user1', { product_ids: [] } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error when no cart items match the provided product_ids', async () => {
      jest
        .spyOn(userItemRepository, 'find')
        .mockResolvedValue([{ product_id: 'p2' } as any]);

      await expect(
        service.createOrder('user1', { product_ids: ['p1'] } as any),
      ).rejects.toThrow();
    });

    it('should adjust item quantity to available stock when requested quantity exceeds stock', async () => {
      const mockProduct = {
        id: 'p1',
        price: 100,
        discount_percentage: 0,
        stock_quantity: 1,
      };

      jest.spyOn(userItemRepository, 'find').mockResolvedValue([
        {
          id: 'item1',
          product_id: 'p1',
          quantity: 5,
          product: mockProduct,
          status: UserProductStatus.CART,
        } as any,
      ]);

      const mockQueryRunner = mockQueryRunnerFactory();
      jest.spyOn(dataSource, 'createQueryRunner').mockReturnValue(mockQueryRunner);
      mockQueryRunner.manager.findOne.mockResolvedValue(mockProduct);
      mockQueryRunner.manager.save.mockResolvedValueOnce({
        id: 'payment1',
      }).mockResolvedValueOnce([]);

      jest
        .spyOn(paymentService, 'createPayPalPaymentSession')
        .mockResolvedValue(undefined);

      jest.spyOn(service, 'findOne').mockResolvedValue({ id: 'order1' } as any);

      const result = await service.createOrder('user1', {
        product_ids: ['p1'],
      } as any);

      expect(result).toBeDefined();
      expect(paymentService.createPayPalPaymentSession).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should rollback transaction when database save operation fails', async () => {
      jest.spyOn(userItemRepository, 'find').mockResolvedValue([
        {
          id: 'item1',
          product_id: 'p1',
          quantity: 1,
          product: { stock_quantity: 10 },
          status: UserProductStatus.CART,
        } as any,
      ]);

      const mockQueryRunner = mockQueryRunnerFactory();
      jest.spyOn(dataSource, 'createQueryRunner').mockReturnValue(mockQueryRunner);

      mockQueryRunner.manager.save.mockRejectedValue(new Error('DB error'));

      await expect(
        service.createOrder('user1', { product_ids: ['p1'] } as any),
      ).rejects.toThrow();
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw error when PayPal payment session creation fails', async () => {
      const mockProduct = {
        id: 'p1',
        price: 100,
        discount_percentage: 0,
        stock_quantity: 10,
      };

      jest.spyOn(userItemRepository, 'find').mockResolvedValue([
        {
          id: 'item1',
          product_id: 'p1',
          quantity: 1,
          product: mockProduct,
          status: UserProductStatus.CART,
        } as any,
      ]);

      const mockQueryRunner = mockQueryRunnerFactory();
      jest.spyOn(dataSource, 'createQueryRunner').mockReturnValue(mockQueryRunner);

      mockQueryRunner.manager.findOne.mockResolvedValue(mockProduct);
      mockQueryRunner.manager.save.mockResolvedValueOnce({
        id: 'payment1',
      }).mockResolvedValueOnce([]);

      jest
        .spyOn(paymentService, 'createPayPalPaymentSession')
        .mockRejectedValue(new Error('PayPal error'));

      await expect(
        service.createOrder('user1', { product_ids: ['p1'] } as any),
      ).rejects.toThrow();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException if product stock is zero', async () => {
      jest.spyOn(userItemRepository, 'find').mockResolvedValue([
        {
          id: 'item1',
          product_id: 'p1',
          quantity: 1,
          product: { stock_quantity: 0 },
          status: UserProductStatus.CART,
        } as any,
      ]);

      await expect(
        service.createOrder('user1', { product_ids: ['p1'] } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findByGatewayOrderId', () => {
    it('should return payment if found', async () => {
      const mockPayment = { id: 'payment1' } as any;

      jest.spyOn(paymentRepository, 'findOne').mockResolvedValue(mockPayment);

      const result = await service.findByGatewayOrderId('gateway123');

      expect(result).toBe(mockPayment);
      expect(paymentRepository.findOne).toHaveBeenCalledWith({
        where: { gateway_order_id: 'gateway123' },
        relations: ['items', 'items.user_item', 'items.product'],
      });
    });

    it('should return null if not found', async () => {
      jest.spyOn(paymentRepository, 'findOne').mockResolvedValue(null);
      const result = await service.findByGatewayOrderId('gateway123');
      expect(result).toBeNull();
    });
  });

  describe('processWebhookCapture', () => {
    it('should return existing payment without processing when payment status is already PAID', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: '1',
        status: Status.PAID,
      } as any);

      const result = await service.processWebhookCapture('1', {
        status: 'COMPLETED',
      } as any);

      expect(result.status).toBe(Status.PAID);
    });
    it('should throw error when payment status is not PENDING during webhook processing', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: '1',
        status: Status.FAILED,
        gateway_order_id: 'paypal123',
      } as any);

      const mockQueryRunner = mockQueryRunnerFactory();
      jest.spyOn(dataSource, 'createQueryRunner').mockReturnValue(mockQueryRunner);
      
      mockQueryRunner.manager.findOne.mockResolvedValue({
            id: '1',
            status: Status.FAILED,
            items: [],
          } as any);
      
      await expect(
        service.processWebhookCapture('1', {
          status: 'COMPLETED',
          supplementary_data: {
            related_ids: {
              order_id: 'paypal123',
            },
          },
        } as any),
      ).rejects.toThrow();
    });

    it('should return payment without updating when webhook capture status is not COMPLETED', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: '1',
        status: Status.PENDING,
        gateway_order_id: 'paypal123',
      } as any);

      const result = await service.processWebhookCapture('1', {
        status: 'DENIED',
        supplementary_data: {
          related_ids: {
            order_id: 'paypal123',
          },
        },
      } as any);

      expect(result).toEqual({
        id: '1',
        status: Status.PENDING,
        gateway_order_id: 'paypal123',
      });
    });

    it('should rollback transaction when product stock deduction fails', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: '1',
        status: Status.PENDING,
        gateway_order_id: 'paypal123',
        items: [],
      } as any);

      const mockQueryRunner = mockQueryRunnerFactory();
      jest.spyOn(dataSource, 'createQueryRunner').mockReturnValue(mockQueryRunner);

      const mockLockedPayment = {
        id: '1',
        status: Status.PENDING,
        items: [
          {
            product_id: 'p1',
            user_item: { quantity: 10 },
          } as any,
        ],
      } as any;

      const mockLockedProduct = {
        id: 'p1',
        stock_quantity: 5,
      } as any;

      mockQueryRunner.manager.findOne
        .mockResolvedValueOnce(mockLockedPayment)
        .mockResolvedValueOnce(mockLockedProduct);

      await expect(
        service.processWebhookCapture('1', {
          status: 'COMPLETED',
          supplementary_data: {
            related_ids: {
              order_id: 'paypal123',
            },
          },
        } as any),
      ).rejects.toThrow();
    });

    it('should return payment without processing if PayPal order ID is missing', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: '1',
        status: Status.PENDING,
        gateway_order_id: 'paypal123',
      } as any);

      const result = await service.processWebhookCapture('1', {
        status: 'COMPLETED',
        supplementary_data: {},
      } as any);

      expect(result.status).toBe(Status.PENDING);
    });

    it('should return payment without processing if PayPal order ID does not match', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue({
        id: '1',
        status: Status.PENDING,
        gateway_order_id: 'paypal123',
      } as any);

      const result = await service.processWebhookCapture('1', {
        status: 'COMPLETED',
        supplementary_data: {
          related_ids: {
            order_id: 'paypal456',
          },
        },
      } as any);

      expect(result.status).toBe(Status.PENDING);
    });

    it('should process successful capture, update status, decrease stock, and clear delivery', async () => {
      const mockPayment = {
        id: '1',
        status: Status.PENDING,
        gateway_order_id: 'paypal123',
        items: [{
          product: { id: 'p1', stock_quantity: 10 },
          user_item: { id: 'item1', quantity: 2, user_id: 'user1' },
        }],
      } as any;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPayment);

      jest
        .spyOn(paymentService, 'applyPayPalToOrder')
        .mockImplementation(() => {});

      jest
        .spyOn(service, 'finalizeSuccessfulPayment')
        .mockResolvedValue({ ...mockPayment, status: Status.PAID });

      const result = await service.processWebhookCapture('1', {
        id: 'capture1',
        status: 'COMPLETED',
        supplementary_data: {
          related_ids: {
            order_id: 'paypal123',
          },
        },
      } as any);

      expect(result.status).toBe(Status.PAID);
      expect(paymentService.applyPayPalToOrder).toHaveBeenCalled();
      expect(service['finalizeSuccessfulPayment']).toHaveBeenCalledWith(mockPayment);
    });
  });

  describe('processOrderPayment', () => {
    it('should return existing payment if already PAID', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ id: '1', status: Status.PAID } as any);

      const result = await service.processOrderPayment('1');
      expect(result.status).toBe(Status.PAID);
    });

    it('should throw BadRequestException if status is not PENDING', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue({ id: '1', status: Status.FAILED } as any);

      await expect(service.processOrderPayment('1')).rejects.toThrow(BadRequestException);
    });

    it('should capture payment, apply to order, and finalize', async () => {
      const mockPayment = { id: '1', status: Status.PENDING } as any;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockPayment);

      const mockCaptureData = { status: 'COMPLETED' } as any;

      jest
        .spyOn(paymentService, 'capturePayPalPayment')
        .mockResolvedValue(mockCaptureData);

      jest
        .spyOn(paymentService, 'applyPayPalToOrder')
        .mockImplementation(() => {});

      jest
        .spyOn(service, 'finalizeSuccessfulPayment')
        .mockResolvedValue({ ...mockPayment, status: Status.PAID });

      const result = await service.processOrderPayment('1');

      expect(result.status).toBe(Status.PAID);
      expect(paymentService.capturePayPalPayment).toHaveBeenCalledWith(
        mockPayment,
      );
      expect(paymentService.applyPayPalToOrder).toHaveBeenCalledWith(
        mockPayment,
        mockCaptureData,
      );
      expect(service['finalizeSuccessfulPayment']).toHaveBeenCalledWith(
        mockPayment,
      );
    });
  });

  describe('finalizeSuccessfulPayment', () => {
    it('should return payment if already PAID', async () => {
      const mockPayment = { id: '1', status: Status.PAID } as any;
      const result = await service['finalizeSuccessfulPayment'](mockPayment);
      expect(result).toBe(mockPayment);
    });

    it('should throw BadRequestException if status is not PENDING', async () => {
      const mockPayment = { id: '1', status: Status.FAILED } as any;
      await expect(
        service['finalizeSuccessfulPayment'](mockPayment),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if locked payment not found', async () => {
      const mockPayment = { id: '1', status: Status.PENDING } as any;

      const mockQueryRunner = mockQueryRunnerFactory();
      jest.spyOn(dataSource, 'createQueryRunner').mockReturnValue(mockQueryRunner);
      mockQueryRunner.manager.findOne.mockResolvedValue(null);

      await expect(
        service['finalizeSuccessfulPayment'](mockPayment),
      ).rejects.toThrow(NotFoundException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should finalize payment: decrease stock, update status, update items, clear delivery', async () => {
      const mockPayment = { id: '1', status: Status.PENDING } as any;
      const mockLockedPayment = {
        id: '1',
        status: Status.PENDING,
        items: [{
          product: { id: 'p1', stock_quantity: 10 },
          user_item: { id: 'item1', quantity: 2, user_id: 'user1' },
          user_item_id: 'item1',
        }],
      } as any;

      const mockQueryRunner = mockQueryRunnerFactory();
      jest.spyOn(dataSource, 'createQueryRunner').mockReturnValue(mockQueryRunner);

      mockQueryRunner.manager.findOne.mockResolvedValue(mockLockedPayment);
      mockQueryRunner.manager.save.mockResolvedValue(mockLockedPayment);
      mockQueryRunner.manager.update.mockResolvedValue(undefined);

      jest
        .spyOn(cartService, 'clearSelectedDeliveryOption').mockResolvedValue(undefined);

      jest
        .spyOn(service, 'decreaseProductStock').mockResolvedValue(undefined);

      const result = await service['finalizeSuccessfulPayment'](mockPayment);

      expect(result.status).toBe(Status.PAID);
      expect(service['decreaseProductStock']).toHaveBeenCalledWith(
        mockLockedPayment,
        mockQueryRunner.manager,
      );
      expect(mockQueryRunner.manager.update).toHaveBeenCalledWith(
        EcommerceUserProductStatus,
        { id: In(['item1']) },
        { status: UserProductStatus.ORDERED },
      );
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(mockLockedPayment);
      expect(cartService.clearSelectedDeliveryOption).toHaveBeenCalledWith(
        'user1',
      );
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should rollback on error', async () => {
      const mockPayment = { id: '1', status: Status.PENDING } as any;

      const mockQueryRunner = mockQueryRunnerFactory();
      jest.spyOn(dataSource, 'createQueryRunner').mockReturnValue(mockQueryRunner);

      mockQueryRunner.manager.findOne.mockResolvedValue({
        id: '1',
        status: Status.PENDING,
        items: [],
      } as any);

      jest
        .spyOn(service, 'decreaseProductStock')
        .mockRejectedValue(new Error('Stock error'));

      await expect(
        service['finalizeSuccessfulPayment'](mockPayment),
      ).rejects.toThrow();
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
});
