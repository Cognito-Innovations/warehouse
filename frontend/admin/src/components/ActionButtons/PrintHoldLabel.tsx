import { Button, CircularProgress } from "@mui/material";
import jsPDF from "jspdf";
import { useState } from "react";

const PrintHoldLabelButton = () => {
    const [isPrintingHold, setIsPrintingHold] = useState(false);

    const handlePrintHoldLabel = () => {
        try{
            setIsPrintingHold(true);
            const doc = new jsPDF();
            doc.text("Hold Label", 20, 20);
            doc.save("hold-label.pdf");
        } finally {
          setIsPrintingHold(false);
        }
    }
    
    return (
        <Button
            variant="contained"
            startIcon={isPrintingHold ? <CircularProgress size={20} color="inherit" /> : null}
            onClick={handlePrintHoldLabel}
            disabled={isPrintingHold}
            sx={{ textTransform: 'none' }}
        >
            {isPrintingHold ? 'Printing...' : 'Print Hold Label'}
        </Button>
    )
}

export default PrintHoldLabelButton;