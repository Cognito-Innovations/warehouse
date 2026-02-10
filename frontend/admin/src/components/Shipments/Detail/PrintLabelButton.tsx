import { useState } from "react";
import { CircularProgress, IconButton } from "@mui/material";
import PrintIcon from '@mui/icons-material/Print';
import { toast } from "sonner";
import { generateCarrierLabelPDF } from "../../PDF/CarrierLabelPDF";

interface PrintLabelButtonProps {
  shipments: any;
  isDiscarded: boolean;
}

export const PrintLabelButton: React.FC<PrintLabelButtonProps> = ({ shipments, isDiscarded }) => {
  const [loading, setLoading] = useState(false);

  const handlePrintClick = async () => {
    if (!shipments) return;
    setLoading(true);
    try {
      await generateCarrierLabelPDF({ ...shipments, num_pieces: "1 PCS" });
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