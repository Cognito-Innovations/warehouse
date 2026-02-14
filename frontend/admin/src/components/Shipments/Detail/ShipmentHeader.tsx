import React from 'react';

import { useShipmentDetail } from '../../../contexts/ShipmentDetailContext';
import RequestHeader from '../../common/RequestHeader';
import StatusActionButtons from '../../StatusActionButtons/StatusActionButtons';
import { FEATURE_CONFIG } from '../../../utils/trackingConfig';
import { getStatusColor } from '../../../utils/statusUtils';

const ShipmentHeader: React.FC = () => {
  const { shipment, isDiscarded, fetchShipments } = useShipmentDetail();

  const user = {
    name: shipment.user?.name || '',
    suite_no: shipment.user?.suite_no ?? '',
    email: shipment.user?.email ?? '',
    phone: shipment.user?.phone_number === 'N/A' ? null : shipment.user?.phone_number,
    alt_phone: shipment.user?.phone_number_2 === 'N/A' ? null : shipment?.phone_number_2,
  };

  const actionButtons = (
    <StatusActionButtons
      feature={FEATURE_CONFIG.SHIPMENT}
      status={shipment.status ?? ''}
      data={shipment}
      onRefresh={fetchShipments}
      disabled={isDiscarded}
    />
  );
  return (
    <RequestHeader
      title="Shipment"
      requestCode={shipment.shipment_no}
      statusDisplay={shipment.status ?? ''}
      statusChipStyles={getStatusColor(shipment.status ?? '')}
      user={user}
      actionButtons={actionButtons}
    />
  );
};

export default ShipmentHeader;