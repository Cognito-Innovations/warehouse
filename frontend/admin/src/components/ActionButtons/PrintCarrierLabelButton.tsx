import { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { toast } from "sonner";
import { updatePackageStatus } from "../../services/api.services";
import { generateCarrierLabelPDF } from "../PDF/CarrierLabelPDF";

export interface CarrierLabelData {
    id: string;
    tracking_no: string;
    status?: { value: string };
    created_at?: string;
    total_weight?: string;
    num_pieces?: string;
    origin_country?: string;
    destination_country?: string;
    measurements?:{
        length?: string;
        width?: string;
        height?: string;
    }
    value_usd?: string;
    shipment_id?: string;
    piece_id?: string;
    items?: [
      {
        name: string,
        quantity: string,
      }
    ],
    user?: {
        name?: string;
        phone_number?: string;
        phone_number_2?: string;
        address?: {
            address?: string;
            city?: string;
            state?: string,
            country?: string;
        };
        preference?: {
            courier?: {
                address?: string;
                phone_number?: string;
            }
        }
    }
}

interface PrintCarrierLabelButtonProps {
    data: CarrierLabelData;
    onRefresh: () => void;
}

const PrintCarrierLabelButton: React.FC<PrintCarrierLabelButtonProps> = ({ data, onRefresh }) => {
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrintCarrierLabel = async () => {
        setIsPrinting(true);
        try {
            // --- 1. Data Validation
            if (!data) {
                toast.error("Required data for carrier label is missing.");
                console.error("Missing data for carrier label:", data);
                return;
            }

            // Generate PDF using the separate component
            await generateCarrierLabelPDF(data);
            toast.success("Carrier Label downloaded successfully!");

            // Update package status if needed
            if (data.status?.value === "Payment Approved") {
                await updatePackageStatus(data.id, "Ready To Ship");
                await onRefresh();
            }

        } catch (error) {
            console.error("Failed to generate PDF carrier label:", error);
            toast.error("Failed to generate PDF. Please try again.");
        } finally {
            setIsPrinting(false);
        }
    };

    return (
        <Button
            variant="contained"
            startIcon={isPrinting ? <CircularProgress size={20} color="inherit" /> : null}
            onClick={handlePrintCarrierLabel}
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