import React from 'react';
import RequestHeader from '../common/RequestHeader';
import StatusActionButtons from '../StatusActionButtons/StatusActionButtons';
import { FEATURE_CONFIG } from '../../utils/trackingConfig';
import { getStatusColor } from '../../utils/statusUtils';
import type { Package } from '../../types';

interface PackageHeaderProps {
  packageData: Package;
  onRefresh?: () => void;
  isDiscarded: boolean;
}

const PackageHeader: React.FC<PackageHeaderProps> = ({ 
  packageData,
  onRefresh,
  isDiscarded,
}) => {
  const customer = {
    name: packageData.customer?.name ?? '',
    suite_no: packageData.customer?.suite_no ?? '',
    email: packageData.customer?.email ?? '',
    phone: packageData.customer?.phone_number === 'N/A' ? null : packageData.customer?.phone_number,
    alt_phone: packageData.customer?.phone_number_2 === 'N/A' ? null : packageData.customer?.phone_number_2,
  };

  const actionButtons = (
    <StatusActionButtons
      feature={FEATURE_CONFIG.PACKAGE}
      status={packageData.status?.value ?? ''}
      data={packageData}
      onRefresh={onRefresh}
      disabled={isDiscarded}
    />
  );

  return (
    <RequestHeader
      title="Package"
      requestCode={packageData.id!}
      statusDisplay={packageData.status?.value ?? ''}
      statusChipStyles={getStatusColor(packageData.status?.value ?? '')}
      customer={customer}
      actionButtons={actionButtons}
    />
  );
};

export default PackageHeader;