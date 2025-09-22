import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";

const PrintLabelButton = () => {
    const [isPrintingHold, setIsPrintingHold] = useState(false);
    const handlePrintHoldLabel = () => {
        setIsPrintingHold(true);
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

export default PrintLabelButton;