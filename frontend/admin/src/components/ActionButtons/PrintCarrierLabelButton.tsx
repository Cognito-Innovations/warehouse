import { Button, CircularProgress } from "@mui/material";
import jsPDF from "jspdf";
import { useState } from "react";
import { updatePackageStatus } from "../../services/api.services";

interface PrintCarrierLabelButtonProps {
    data: any;
    onRefresh: () => void;
}

const PrintCarrierLabelButton: React.FC<PrintCarrierLabelButtonProps> = ({ data, onRefresh }) => {
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrintCarrierLabelButton = async () => {
        try {
            setIsPrinting(true);
        
            const doc = new jsPDF();
            doc.text("Carrier Label", 20, 20);
            doc.save("carrier-label.pdf");
        
            if (data.status?.value === "Payment Approved") {
                await updatePackageStatus(data.id, "Ready To Ship");
                await onRefresh();
            }
        } finally {
          setIsPrinting(false);
        }
    }
    return (
        <Button
            variant="contained"
            startIcon={isPrinting ? <CircularProgress size={20} color="inherit" /> : null}
            onClick={handlePrintCarrierLabelButton}
            disabled={isPrinting}
            sx={{
                textTransform: 'none',
                bgcolor: "#a855f7",
                "&:hover": { bgcolor: "#9333ea" },
            }}
        >
            {isPrinting ? 'Printing...' : 'Print Carrier Label'}
        </Button>
    )
}

export default PrintCarrierLabelButton;