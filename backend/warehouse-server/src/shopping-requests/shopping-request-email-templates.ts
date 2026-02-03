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
      content = `
        <p>Hello ${user.name || 'User'},</p>
        <p>The quotation for your shopping request <strong>${request.request_code}</strong> is now ready.</p>
        <p>Please log in to your account to review the details and proceed with payment.</p>
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
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} <span style="color: ${BRAND_COLOR}; font-weight: bold;">${BRAND_NAME}</span>. All rights reserved.</p>
      </div>
    </div>
  `;

  return { subject, html };
}
