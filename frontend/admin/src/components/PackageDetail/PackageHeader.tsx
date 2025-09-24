import React from 'react';
import RequestHeader from '../common/RequestHeader';
import StatusActionButtons from '../StatusActionButtons/StatusActionButtons';
import { FEATURE_CONFIG } from '../../utils/trackingConfig';
import { getStatusColor } from '../../data/packages';

interface PackageData {
  id: string;
  status: { value: string }; 
  customer: string;
  suite: string;
  email: string;
  phone: string;
  phone2: string;
  [key: string]: any; 
}

interface PackageHeaderProps {
  packageData: PackageData;
  onRefresh?: () => void;
  isDiscarded: boolean;
}

const PackageHeader: React.FC<PackageHeaderProps> = ({ 
  packageData,
  onRefresh,
  isDiscarded,
}) => {
  const customer = {
    name: packageData.customer,
    suite_no: packageData.suite,
    email: packageData.email,
    phone: packageData.phone === 'N/A' ? null : packageData.phone,
    alt_phone: packageData.phone2 === 'N/A' ? null : packageData.phone2,
  };

  const actionButtons = (
    <StatusActionButtons
      feature={FEATURE_CONFIG.PACKAGE}
      status={packageData.status.value}
      data={packageData}
      onRefresh={onRefresh}
      disabled={isDiscarded}
    />
  );

  return (
    <RequestHeader
      title="Package"
      requestCode={packageData.id}
      statusDisplay={packageData.status.value}
      statusChipStyles={getStatusColor(packageData.status.value)}
      customer={customer}
      actionButtons={actionButtons}
    />
  );
};

export default PackageHeader;