import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { toast } from "sonner";
import { usePackageLabelPDF } from "../PackageDetail/PackageLabelPDF";
import type { PackageData } from "../../types";

interface PrintLabelButtonProps {
  data: PackageData;
}

const PrintLabelButton: React.FC<PrintLabelButtonProps> = ({ data }) => {
    const [isPrinting, setIsPrinting] = useState(false);
    const { generatePDF } = usePackageLabelPDF({ data });
    
    const handlePrintLabel = async () => {
        setIsPrinting(true);
        try {
            await generatePDF();
            toast.success("Label opened in new tab!");
        } catch (error) {
            console.error("Failed to generate PDF label:", error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsPrinting(false);
        }    
    }

    return (
        <Button
            variant="contained"
            startIcon={isPrinting ? <CircularProgress size={20} color="inherit" /> : null}
            onClick={handlePrintLabel}
            disabled={isPrinting}
            sx={{ textTransform: 'none' }}
        >
            {isPrinting ? 'Printing...' : 'Print  Label'}
        </Button>
    )
}

export default PrintLabelButton;