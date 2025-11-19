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
  const user = {
    name: packageData.user?.name || '',
    suite_no: packageData.user?.suite_no ?? '',
    email: packageData.user?.email ?? '',
    phone: packageData.user?.phone_number === 'N/A' ? null : packageData.user?.phone_number,
    alt_phone: packageData.user?.phone_number_2 === 'N/A' ? null : packageData?.phone_number_2,
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
      requestCode={packageData.package_id!}
      statusDisplay={packageData.status?.value ?? ''}
      statusChipStyles={getStatusColor(packageData.status?.value ?? '')}
      user={user}
      actionButtons={actionButtons}
    />
  );
};

export default PackageHeader;