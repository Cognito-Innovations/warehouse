import { Test } from '@nestjs/testing';
import { PaymentWebhookController } from './payment-webhook.controller';
import { PaymentService } from '../services/payment.service';
import { OrderService } from '../services/ecommerce-order.service';

describe('PaymentWebhookController', () => {
  let controller: PaymentWebhookController;
  let paymentService: PaymentService;
  let orderService: OrderService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [PaymentWebhookController],
      providers: [
        { provide: PaymentService, useValue: { verifyWebhook: jest.fn() } },
        {
          provide: OrderService,
          useValue: {
            findByGatewayOrderId: jest.fn(),
            processWebhookCapture: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(PaymentWebhookController);
    paymentService = module.get(PaymentService);
    orderService = module.get(OrderService);
  });

  it('should process webhook when capture completed', async () => {
    const body = {
      event_type: 'PAYMENT.CAPTURE.COMPLETED',
      resource: {
        id: 'cap1',
        status: 'COMPLETED',
        supplementary_data: {
          related_ids: { order_id: 'order1' },
        },
      },
    };

    jest
      .spyOn(orderService, 'findByGatewayOrderId')
      .mockResolvedValue({ id: 'order1' } as any);

    await controller.handleWebhook(
      {
        'paypal-auth-algo': 'algo',
        'paypal-cert-url': 'url',
        'paypal-transmission-id': 'id',
        'paypal-transmission-sig': 'sig',
        'paypal-transmission-time': 'time',
      },
      { body } as any,
    );

    expect(paymentService.verifyWebhook).toHaveBeenCalled();
    expect(orderService.processWebhookCapture).toHaveBeenCalled();
  });

  it('should throw when webhook verification fails', async () => {
    jest
      .spyOn(paymentService, 'verifyWebhook')
      .mockRejectedValue(new Error('Invalid signature'));

    await expect(
      controller.handleWebhook({} as any, { body: {} } as any),
    ).rejects.toThrow();
  });

  it('should ignore webhook when event type is not PAYMENT.CAPTURE.COMPLETED', async () => {
    const body = { event_type: 'PAYMENT.CAPTURE.DENIED' };

    await controller.handleWebhook({} as any, { body } as any);

    expect(orderService.processWebhookCapture).not.toHaveBeenCalled();
  });

  it('should ignore webhook when capture status is not COMPLETED', async () => {
    const body = {
      event_type: 'PAYMENT.CAPTURE.COMPLETED',
      resource: { status: 'PENDING' },
    };

    await controller.handleWebhook({} as any, { body } as any);

    expect(orderService.processWebhookCapture).not.toHaveBeenCalled();
  });

  it('should not process when payment not found', async () => {
    const body = {
      event_type: 'PAYMENT.CAPTURE.COMPLETED',
      resource: {
        status: 'COMPLETED',
        supplementary_data: { related_ids: { order_id: 'order1' } },
      },
    };

    jest.spyOn(orderService, 'findByGatewayOrderId').mockResolvedValue(null);

    await controller.handleWebhook({} as any, { body } as any);

    expect(orderService.processWebhookCapture).not.toHaveBeenCalled();
  });
});
