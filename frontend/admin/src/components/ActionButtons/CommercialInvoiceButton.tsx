import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";

const CommercialInvoiceButton = () => {
    const [isPrinting, setIsPrinting] = useState(false);
    const handleCommercialInvoiceButton = () => {
        setIsPrinting(true);
    }
    return (
        <Button
            variant="contained"
            startIcon={isPrinting ? <CircularProgress size={20} color="inherit" /> : null}
            onClick={handleCommercialInvoiceButton}
            disabled={isPrinting}
            sx={{
                textTransform: 'none',
                bgcolor: "#a855f7",
                "&:hover": { bgcolor: "#9333ea" },
            }}
        >
            {isPrinting ? 'Printing...' : 'Commercial Invoice'}
        </Button>
    )
}

export default CommercialInvoiceButton;