import React from 'react';
import StatusActionButtons from '../../StatusActionButtons/StatusActionButtons';
import { FEATURE_CONFIG } from '../../../utils/trackingConfig';
import RequestHeader from '../../common/RequestHeader';
import { getStatusColor } from '../../../utils/statusUtils';

interface ShipmentHeaderProps {
  shipments: any;
  onRefresh?: () => void;
}

const ShipmentHeader: React.FC<ShipmentHeaderProps> = ({ 
  shipments,
  onRefresh,
}) => {
  const user = {
    name: shipments.user?.name || '',
    suite_no: shipments.user?.suite_no ?? '',
    email: shipments.user?.email ?? '',
    phone: shipments.user?.phone_number === 'N/A' ? null : shipments.user?.phone_number,
    alt_phone: shipments.user?.phone_number_2 === 'N/A' ? null : shipments?.phone_number_2,
  };

  const actionButtons = (
    <StatusActionButtons
      feature={FEATURE_CONFIG.SHIPMENT}
      status={shipments.status ?? ''}
      data={shipments}
      onRefresh={onRefresh}
    />
  );
  return (
    <RequestHeader
      title="Shipment"
      requestCode={shipments.shipment_no!}
      statusDisplay={shipments.status ?? ''}
      statusChipStyles={getStatusColor(shipments.status ?? '')}
      user={user}
      actionButtons={actionButtons}
    />
  );
};

export default ShipmentHeader;