import { User } from '../users/user.entity';
import {
  ShoppingRequest,
  ShoppingRequestStatus,
} from './shopping-request.entity';

export type ShoppingRequestEmailType =
  | 'request-created'
  | 'quotation-ready'
  | 'payment-approved'
  | 'status-updated';

export function getShoppingRequestEmailTemplate(
  type: ShoppingRequestEmailType,
  user: User,
  request: ShoppingRequest,
  status?: ShoppingRequestStatus,
): { subject: string; html: string } {
  const BRAND_COLOR = '#7C3AED';
  const BRAND_NAME = 'Palakart';

  let subject = '';
  let title = '';
  let content = '';

  switch (type) {
    case 'request-created':
      subject = 'Your Shopping Request Has Been Submitted';
      title = 'Shopping Request Submitted';
      content = `
        <p>Hello ${user.name || 'User'},</p>
        <p>Your shopping request <strong>${request.request_code}</strong> has been successfully submitted.</p>
        <p>Details:</p>
        <ul>
          <li>Items count: ${request.items_count}</li>
          <li>Status: Requested</li>
        </ul>
        <p>We will process your request soon and update you with the quotation.</p>
      `;
      break;
    case 'quotation-ready':
      subject = 'Your Shopping Quotation is Ready';
      title = 'Quotation Ready';

      const quotationAmount = (request as any)?.invoice?.total || '—';

      content = `
        <p>Hello ${user.name || 'User'},</p>

        <p style="margin-bottom:12px;">
          Great news! The quotation for your shopping request
          <strong>${request.request_code}</strong> is ready.
        </p>

        <div
          style="
            background:#F5F3FF;
            border:1px solid #E9D5FF;
            padding:18px;
            border-radius:10px;
            margin:18px 0;
            text-align:center;
          "
        >
          <p style="margin:0; font-size:13px; color:#6B7280;">
            Total Payable Amount
          </p>
          <p
            style="
              margin:6px 0 0;
              font-size:24px;
              font-weight:bold;
              color:${BRAND_COLOR};
            "
          >
            ${quotationAmount}
          </p>
        </div>

        <p style="margin:20px 0 8px; font-weight:bold;">
          Payment Instructions
        </p>

        <p style="margin-top:0;">
          Please complete the payment using the bank details below.
        </p>

        <div
          style="
            background:#FAFAFA;
            border:1px solid #E5E7EB;
            padding:16px;
            border-radius:8px;
            margin-bottom:20px;
          "
        >
          <p style="margin:4px 0;"><strong>Bank Name:</strong> CIMB Bank</p>
          <p style="margin:4px 0;"><strong>Account Name:</strong> Ameera F&B Enterprise</p>
          <p style="margin:4px 0;"><strong>Account Number:</strong> 8009529150</p>
          <p style="margin:4px 0;"><strong>SWIFT Code:</strong> CIBBMYKLXXX</p>
          <p style="margin:4px 0;"><strong>Reference:</strong> Payment – Textile</p>
        </div>

        <p style="margin-bottom:8px; font-weight:bold;">
          What to do next
        </p>

        <ol style="padding-left:18px; margin-top:0;">
          <li style="margin-bottom:6px;">
            Complete the payment using the bank details above.
          </li>
          <li style="margin-bottom:6px;">
            Take a screenshot after successful payment.
          </li>
          <li style="margin-bottom:6px;">
            Log in to your account and open
            <a
              href="https://www.palakart.com/ecommerce/assisted-shopping/history"
              target="_blank"
              style="color:${BRAND_COLOR}; font-weight:600; text-decoration:none;"
            >
              Assisted Shopping History
            </a>.
          </li>
          <li style="margin-bottom:6px;">
            Select your request and upload the payment screenshot.
          </li>
          <li>
            Our team will verify it and get back to you shortly.
          </li>
        </ol>
      `;
      break;
    case 'payment-approved':
      subject = 'Payment Approved for Your Shopping Request';
      title = 'Payment Approved';
      content = `
        <p>Hello ${user.name || 'User'},</p>
        <p>Your payment for shopping request <strong>${request.request_code}</strong> has been approved.</p>
        <p>We will now proceed with procuring the items. You can track the status in your account.</p>
      `;
      break;
    case 'status-updated':
      subject = `Update on Your Shopping Request ${request.request_code}`;
      title = 'Request Status Update';
      content = `
        <p>Hello ${user.name || 'User'},</p>
        <p>The status of your shopping request <strong>${request.request_code}</strong> has been updated to <strong>${status}</strong>.</p>
        <p>Please check your account for more details.</p>
      `;
      break;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: ${BRAND_COLOR}; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">${title}</h1>
      </div>
      <div style="background-color: #ffffff; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
        ${content}
        <p>Thanks,<br>The ${BRAND_NAME} Team</p>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #888;">
        <div
          style="
            background:#FAFAFA;
            border:1px solid #E5E7EB;
            border-radius:8px;
            padding:14px;
            margin-bottom:12px;
          "
        >
          <p style="margin:0 0 6px; font-weight:bold; color:#333;">
            Need help?
          </p>

          <p style="margin:4px 0;">
            📞
            <a
              href="tel:+916382262427"
              style="color:${BRAND_COLOR}; text-decoration:none; font-weight:500;"
            >
              +91 6382 262 427
            </a>
          </p>

          <p style="margin:4px 0;">
            ✉️
            <a
              href="mailto:team.palakart@gmail.com"
              style="color:${BRAND_COLOR}; text-decoration:none; font-weight:500;"
            >
              team.palakart@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  `;

  return { subject, html };
}
