import React from 'react';
import { Stack } from '@mui/material';
import { StatusActionMap } from '../../utils/trackingConfig';

interface StatusActionButtonsProps {
  feature: string;
  status: string;
  data: any;
  [key: string]: any;
}

const StatusActionButtons: React.FC<StatusActionButtonsProps> = ({ feature, status, data, ...restProps }) => {
  const buttonConfigs = StatusActionMap[feature]?.[status] || [];
  if (!buttonConfigs.length) {
    return null;
  }

  return (
    <Stack direction="row" spacing={1}>
      {buttonConfigs.map((config, index) => {
        const ButtonComponent = config.component;
        return <ButtonComponent key={index} data={data} {...restProps} />;
      })}
    </Stack>
  );
};

export default StatusActionButtons;