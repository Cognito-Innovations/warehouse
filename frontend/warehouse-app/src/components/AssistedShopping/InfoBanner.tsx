import React from 'react';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';

interface InfoBannerProps {
  message: string;
}

const InfoBanner: React.FC<InfoBannerProps> = ({ message }) => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg flex items-center gap-3">
      <InfoIcon className="text-blue-600"/>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default InfoBanner;