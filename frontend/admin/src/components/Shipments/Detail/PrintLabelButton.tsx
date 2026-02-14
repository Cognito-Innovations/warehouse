import { useState } from "react";
import { CircularProgress, IconButton } from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import { toast } from "sonner";

import { useShipmentDetail } from "../../../contexts/ShipmentDetailContext";
import { generateCarrierLabelPDF } from "../../PDF/CarrierLabelPDF";

export const PrintLabelButton: React.FC = () => {
  const { shipment, isDiscarded } = useShipmentDetail();

  const [loading, setLoading] = useState(false);

  const handlePrintClick = async () => {
    if (!shipment) return;
    setLoading(true);
    try {
      await generateCarrierLabelPDF({ ...shipment, num_pieces: "1 PCS" });
      toast.success("Carrier label generated");
    } catch (error) {
      toast.error("Failed to generate Carrier Label PDF");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IconButton
      onClick={!isDiscarded ? handlePrintClick : undefined}
      disabled={loading || isDiscarded}
      sx={{
        width: 26,
        height: 26,
        bgcolor: isDiscarded ? '#cbd5e1' : '#0ea5e9',
        color: isDiscarded ? '#64748b' : '#fff',
        borderRadius: '50%',
        cursor: isDiscarded ? 'not-allowed' : 'pointer',
        opacity: isDiscarded ? 0.6 : 1,
        '&:hover': !isDiscarded && {
          bgcolor: '#0284c7'
        }
      }}
    >
      {loading ? (
        <CircularProgress size={20} sx={{ color: '#fff' }} />
      ) : (
        <PrintIcon fontSize='small' />
      )}
    </IconButton>
  );
};