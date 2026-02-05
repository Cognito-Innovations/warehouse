import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EcommercePayment,
  Status,
} from '../entities/ecommerce-payments.entity';

interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  scope: string;
  nonce: string;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
  payment_source?: {
    paypal?: {
      email_address?: string;
      account_id?: string;
    };
    card?: {
      brand?: string;
      last_digits?: string;
    };
  };
  purchase_units: Array<{
    payments: {
      captures: Array<{
        id: string;
        status: string;
      }>;
    };
  }>;
}

@Injectable()
export class PaymentService {
  private readonly clientId: string;
  private readonly secretKey: string;
  private readonly mode: string;
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(EcommercePayment)
    private readonly paymentRepository: Repository<EcommercePayment>,
  ) {
    this.clientId = process.env.PAYPAL_CLIENT_ID!;
    this.secretKey = process.env.PAYPAL_SECRET_KEY!;
    this.mode = process.env.PAYPAL_MODE || 'sandbox';

    if (!this.clientId || !this.secretKey) {
      throw new BadRequestException('PayPal credentials not configured');
    }

    this.baseUrl =
      this.mode === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';
  }

  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.secretKey}`).toString(
      'base64',
    );
    const response = await firstValueFrom(
      this.httpService.post<PayPalAccessTokenResponse>(
        `${this.baseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      ),
    );
    return response.data.access_token;
  }

  async createPayPalPaymentSession(
    payment: EcommercePayment,
    orderNumber: string,
    usdAmount: number,
  ): Promise<void> {
    const token = await this.getAccessToken();

    const paypalOrderRequest = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: usdAmount.toFixed(2),
          },
          description: `Order ${orderNumber}`,
        },
      ],
      application_context: {
        return_url: `${process.env.FRONTEND_URL}/order`,
        cancel_url: `${process.env.FRONTEND_URL}/cart`,
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
      },
    };

    const response = await firstValueFrom(
      this.httpService.post<PayPalOrderResponse>(
        `${this.baseUrl}/v2/checkout/orders`,
        paypalOrderRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'PayPal-Request-Id': orderNumber,
          },
        },
      ),
    );

    if (response.data.status !== 'CREATED') {
      throw new Error('PayPal order creation failed');
    }

    payment.gateway_order_id = response.data.id;
    await this.paymentRepository.save(payment);
  }

  async capturePayPalPayment(
    payment: EcommercePayment,
  ): Promise<PayPalCaptureResponse> {
    try {
      const token = await this.getAccessToken();

      const captureResponse = await firstValueFrom(
        this.httpService.post<PayPalCaptureResponse>(
          `${this.baseUrl}/v2/checkout/orders/${payment.gateway_order_id}/capture`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const captureData = captureResponse.data;

      if (captureData.status !== 'COMPLETED') {
        throw new BadRequestException('PayPal capture failed');
      }

      return captureData;
    } catch (captureError: unknown) {
      console.error('Error capturing PayPal payment:', captureError);
      throw new BadRequestException('Failed to capture payment');
    }
  }

  applyPayPalToOrder(
    payment: EcommercePayment,
    captureData: PayPalCaptureResponse,
  ): void {
    const capture = captureData.purchase_units[0].payments.captures[0];

    payment.status = Status.PAID;
    payment.gateway_transaction_id = capture.id;

    const paymentSource = captureData.payment_source;

    if (paymentSource?.paypal) {
      payment.payment_mode = 'PAYPAL_BALANCE';
    } else if (paymentSource?.card) {
      payment.payment_mode = `CARD_${paymentSource.card.brand ?? 'UNKNOWN'}`;
    } else {
      payment.payment_mode = 'UNKNOWN';
    }
  }
}
