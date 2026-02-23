import { Test } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
import {
  EcommercePayment,
  Status,
} from '../entities/ecommerce-payments.entity';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpService: HttpService;
  let repository: any;

  beforeEach(async () => {
    process.env.PAYPAL_CLIENT_ID = 'client';
    process.env.PAYPAL_SECRET_KEY = 'secret';
    process.env.PAYPAL_WEBHOOK_ID = 'webhook';

    const module = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: HttpService,
          useValue: { post: jest.fn() },
        },
        {
          provide: getRepositoryToken(EcommercePayment),
          useValue: { save: jest.fn() },
        },
      ],
    }).compile();

    service = module.get(PaymentService);
    httpService = module.get(HttpService);
    repository = module.get(getRepositoryToken(EcommercePayment));
  });

  it('should return access token', async () => {
    jest.spyOn(httpService, 'post').mockReturnValue(
      of({
        data: { access_token: 'token123' },
      }),
    );

    const token = await service.getAccessToken();

    expect(token).toBe('token123');
  });

  it('should throw if token request fails', async () => {
    jest.spyOn(httpService, 'post').mockImplementation(() => {
      throw new Error();
    });

    await expect(service.getAccessToken()).rejects.toThrow();
  });

  it('should save gateway_order_id when PayPal order created', async () => {
    jest.spyOn(service, 'getAccessToken').mockResolvedValue('token');

    jest.spyOn(httpService, 'post').mockReturnValue(
      of({
        data: { status: 'CREATED', id: 'order123' }
      }),
    );

    const payment = {};

    await service.createPayPalPaymentSession(payment as any, 'ORD1', 100);

    expect(repository.save).toHaveBeenCalled();
  });

  it('should throw when PayPal order not CREATED', async () => {
    jest.spyOn(service, 'getAccessToken').mockResolvedValue('token');

    jest.spyOn(httpService, 'post').mockReturnValue(
      of({
        data: { status: 'FAILED' },
      }),
    );

    await expect(
      service.createPayPalPaymentSession({} as any, 'ORD1', 100),
    ).rejects.toThrow();
  });

  it('should throw when webhook headers missing', async () => {
    await expect(service.verifyWebhook({} as any, {})).rejects.toThrow();
  });

  it('should throw when signature invalid', async () => {
    const mockHeaders = {
      'paypal-auth-algo': 'SHA256withRSA',
      'paypal-cert-url': 'https://cert.url',
      'paypal-transmission-id': 'trans-id',
      'paypal-transmission-sig': 'sig',
      'paypal-transmission-time': 'time',
    };

    jest.spyOn(service, 'getAccessToken').mockResolvedValue('token');

    jest.spyOn(httpService, 'post').mockReturnValue(
      of({
        data: { verification_status: 'FAILURE' }
      }),
    );

    await expect(service.verifyWebhook(mockHeaders, {})).rejects.toThrow();
  });

  it('should return capture data when COMPLETED', async () => {
    jest.spyOn(service, 'getAccessToken').mockResolvedValue('token');

    jest.spyOn(httpService, 'post').mockReturnValue(
      of({
        data: { status: 'COMPLETED' },
      }),
    );

    const result = await service.capturePayPalPayment({
      gateway_order_id: '1',
    } as any);

    expect(result.status).toBe('COMPLETED');
  });

  it('should throw when capture not completed', async () => {
    jest.spyOn(service, 'getAccessToken').mockResolvedValue('token');

    jest.spyOn(httpService, 'post').mockReturnValue(
      of({
        data: { status: 'FAILED' },
      }),
    );

    await expect(
      service.capturePayPalPayment({ gateway_order_id: '1' } as any),
    ).rejects.toThrow();
  });

  it('should set PAYPAL_BALANCE mode', () => {
    const payment = { status: Status.PENDING } as any;

    service.applyPayPalToOrder(payment, {
      purchase_units: [{ payments: { captures: [{ id: 'cap1' }] } }],
      payment_source: { paypal: {} },
    } as any);

    expect(payment.status).toBe(Status.PAID);
    expect(payment.payment_mode).toBe('PAYPAL_BALANCE');
  });

  it('should set CARD mode', () => {
    const payment = {} as any;

    service.applyPayPalToOrder(payment, {
      purchase_units: [{ payments: { captures: [{ id: 'cap1' }] } }],
      payment_source: { card: { brand: 'VISA' } },
    } as any);

    expect(payment.payment_mode).toBe('CARD_VISA');
  });

  it('should throw when capture data invalid', () => {
    expect(() => service.applyPayPalToOrder({} as any, {} as any)).toThrow();
  });
});
