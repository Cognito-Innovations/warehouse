import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  EcommercePayment,
  Status,
} from '../entities/ecommerce-payments.entity';
import {
  PayPalAccessTokenResponse,
  PayPalCaptureResponse,
  PayPalOrderResponse,
  PayPalVerifyWebhookRequest,
  PayPalVerifyWebhookResponse,
} from 'src/types/payment-service.types';
import { PayPalWebhookHeaders } from 'src/types/paypal-webhook.types';

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

  async verifyWebhook(
    headers: PayPalWebhookHeaders,
    body: unknown,
  ): Promise<void> {
    try {
      const token = await this.getAccessToken();

      const {
        'paypal-auth-algo': authAlgo,
        'paypal-cert-url': certUrl,
        'paypal-transmission-id': transmissionId,
        'paypal-transmission-sig': transmissionSig,
        'paypal-transmission-time': transmissionTime,
      } = headers;

      if (
        !authAlgo ||
        !certUrl ||
        !transmissionId ||
        !transmissionSig ||
        !transmissionTime
      ) {
        throw new BadRequestException('Missing PayPal webhook headers');
      }

      const webhookId = process.env.PAYPAL_WEBHOOK_ID;

      if (!webhookId) {
        throw new InternalServerErrorException(
          'PAYPAL_WEBHOOK_ID not configured',
        );
      }

      const payload: PayPalVerifyWebhookRequest = {
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: body,
      };

      const response = await firstValueFrom(
        this.httpService.post<PayPalVerifyWebhookResponse>(
          `${this.baseUrl}/v1/notifications/verify-webhook-signature`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      if (response.data.verification_status !== 'SUCCESS') {
        throw new BadRequestException('Invalid PayPal webhook signature');
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('PayPal webhook verification failed:', error);

      throw new InternalServerErrorException('Webhook verification failed');
    }
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
    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];

    if (!capture) {
      throw new BadRequestException('Invalid capture data from PayPal');
    }

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
