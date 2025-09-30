import React from "react";
import { InfoOutlined as InfoIcon } from "@mui/icons-material";

interface InfoBannerProps {
  message: string;
  isRejected?: boolean;
}

const InfoBanner: React.FC<InfoBannerProps> = ({ message, isRejected = false }) => {
  const bannerClasses = isRejected
    ? 'bg-red-50 border-red-500 text-red-800'
    : 'bg-purple-50 border-purple-500 text-purple-800';

    const title = isRejected ? 'Request Rejected' : 'Information';

  return (
    <div className={`border-l-4 p-4 ${bannerClasses}`} role="alert">
      <p className="font-bold">{title}</p>
      <p>{message}</p>
    </div>
  );
};

export default InfoBanner;