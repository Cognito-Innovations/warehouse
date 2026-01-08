import React from "react";
import { formatDateTime } from "@/lib/utils";
import { 
  HourglassEmpty as HourglassIcon, 
  CheckCircle as CheckIcon 
} from "@mui/icons-material";

interface ShareOtpTableRowProps {
  data: any;
}

const ShareOtpTableRow: React.FC<ShareOtpTableRowProps> = ({ data }) => {
  const isPending = data.status === "pending";

  return (
    <tr className="hover:bg-gray-50/80 transition-colors duration-200 group">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-bold text-gray-900">{data.tracking_no}</div>
        <div className="text-xs text-gray-400">{data.id}</div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-block bg-purple-50 text-purple-700 px-3 py-1 rounded-md font-mono font-bold text-sm tracking-wider border border-purple-100">
            {data.otp}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            isPending ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
        }`}>
            {isPending ? <HourglassIcon style={{ fontSize: 16 }} /> : <CheckIcon style={{ fontSize: 16 }} />}
            {data.status}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="text-sm text-gray-600 font-medium">
            {formatDateTime(data.created_at)}
        </div>
      </td>
    </tr>
  );
};

export default ShareOtpTableRow;