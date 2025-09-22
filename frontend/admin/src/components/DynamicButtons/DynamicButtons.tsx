import React from 'react';
import { Stack } from '@mui/material';
import { STATUS_CONFIG } from '../../utils/trackingConfig';

interface DynamicButtonsProps {
  feature: string;
  status: string;
  data: any;
  [key: string]: any;
}

const DynamicButtons: React.FC<DynamicButtonsProps> = ({ feature, status, data, ...restProps }) => {
  const buttonConfigs = STATUS_CONFIG[feature]?.[status] || [];
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

export default DynamicButtons;