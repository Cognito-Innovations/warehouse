import React, { useState } from 'react';

import { updatePickupRequestStatus } from '../../../services/api.services';
import RequestHeader from '../../common/RequestHeader';
import PickupRequestActionButtons from './PickupRequestActionButtons';
import SendQuotationModal from './SendQuotationModal';
import { TRACKING_STATUS } from '../../../utils/trackingConfig';
import { getChipStyles } from '../../../utils/pickupStatus';
import type { TrackingStatusValue } from '../../../types';

interface Users {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  suite_no?: string;
}

interface Request {
  id: string;
  status: string;
  user: Users;
}

interface RequestDetailHeaderProps {
  request: Request;
  onStatusUpdate: () => void;
}

const RequestDetailHeader: React.FC<RequestDetailHeaderProps> = ({ request, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const normalizedStatus = request.status.toUpperCase();
  const chipStyles = getChipStyles(normalizedStatus);

  const handleOpenModal = () => setOpenModal(true);

  const handleStatusUpdate = async (status: TrackingStatusValue, price?: number) => {
    try {
      setLoading(true);
      await updatePickupRequestStatus(request.id, status, price);
      onStatusUpdate();
      if (status === TRACKING_STATUS.QUOTED) {
        setOpenModal(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const user = {
    name: request.user.name,
    email: request.user.email,
    phone: request.user.phone_number,
    suite_no: request.user.suite_no,
  };

  return (
    <>
      <RequestHeader
        title="Pickup Request"
        requestCode={request.id}
        statusDisplay={normalizedStatus}
        statusChipStyles={{
          color: chipStyles.color,
          bgColor: chipStyles.backgroundColor,
        }}
        user={user}
        actionButtons={
          <PickupRequestActionButtons
            status={normalizedStatus}
            loading={loading}
            onOpenModal={handleOpenModal}
            onStatusUpdate={handleStatusUpdate}
          />
        }
      />

      <SendQuotationModal
        requestId={request.id}
        open={openModal}
        loading={loading}
        onClose={() => setOpenModal(false)}
        onSubmit={handleStatusUpdate}
      />
    </>
  );
};

export default RequestDetailHeader;