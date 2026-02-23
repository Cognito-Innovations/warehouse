import { Controller, Post, Headers, Req, HttpCode } from '@nestjs/common';
import type { Request } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';
import { PaymentService } from '../services/payment.service';
import { OrderService } from '../services/ecommerce-order.service';
import type {
  PayPalCaptureResource,
  PayPalWebhookEvent,
  PayPalWebhookHeaders,
} from 'src/types/paypal-webhook.types';

@Controller('payments/webhook')
export class PaymentWebhookController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) {}

  @Public()
  @Post()
  @HttpCode(200)
  async handleWebhook(
    @Headers() headers: PayPalWebhookHeaders,
    @Req() req: Request<unknown, unknown, unknown>,
  ) {
    const body = req.body as PayPalWebhookEvent;

    await this.paymentService.verifyWebhook(headers, body);

    const { event_type } = body;

    if (event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = body.resource as PayPalCaptureResource;

      if (resource.status !== 'COMPLETED') {
        return 'OK';
      }

      const paypalOrderId = resource.supplementary_data?.related_ids?.order_id;

      const payment =
        await this.orderService.findByGatewayOrderId(paypalOrderId);

      if (!payment) {
        return 'OK';
      }

      await this.orderService.processWebhookCapture(payment.id, resource);
    }
    return 'OK';
  }
}
