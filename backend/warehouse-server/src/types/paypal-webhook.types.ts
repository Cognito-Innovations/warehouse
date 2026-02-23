export interface PayPalWebhookEvent<TResource = unknown> {
  id: string;
  event_type: string;
  resource: TResource;
}

export interface PayPalCaptureResource {
  id: string;
  status: string;
  payment_source?: {
    paypal?: {
      email_address?: string;
    };
    card?: {
      brand?: string;
    };
  };
  supplementary_data: {
    related_ids: {
      order_id: string;
    };
  };
}

export interface PayPalWebhookHeaders {
  'paypal-auth-algo': string;
  'paypal-cert-url': string;
  'paypal-transmission-id': string;
  'paypal-transmission-sig': string;
  'paypal-transmission-time': string;
}
