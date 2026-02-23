export interface PayPalAccessTokenResponse {
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  scope: string;
  nonce: string;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
}

export interface PayPalCaptureResponse {
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

export interface PayPalVerifyWebhookRequest {
  auth_algo: string;
  cert_url: string;
  transmission_id: string;
  transmission_sig: string;
  transmission_time: string;
  webhook_id: string;
  webhook_event: unknown;
}

export interface PayPalVerifyWebhookResponse {
  verification_status: 'SUCCESS' | 'FAILURE';
}
