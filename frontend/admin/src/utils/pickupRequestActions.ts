import { TRACKING_STATUS } from './trackingConfig';
import type { PickupActionConfig } from '../types';

export const PICKUP_REQUEST_ACTIONS: Record<string, PickupActionConfig[]> = {
  REQUESTED: [
    {
      label: 'Send Quotation',
      color: 'primary',
      requiresModal: true,
    },
  ],
  QUOTED: [
    {
      label: 'Reject',
      color: 'danger',
      statusToUpdate: TRACKING_STATUS.CANCELLED,
    },
  ],
  CONFIRMED: [
    {
      label: 'Complete',
      color: 'primary',
      statusToUpdate: TRACKING_STATUS.PICKED,
    },
  ],
};