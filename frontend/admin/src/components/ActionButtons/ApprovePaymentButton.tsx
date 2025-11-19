import { Button, CircularProgress } from "@mui/material"
import { useState } from "react";
import { toast } from "sonner";
import { updateShipmentStatus } from "../../services/api.services";

interface ApprovePaymentButtonProps {
    data: any;
    onRefresh: () => void;
}

const ApprovePaymentButton: React.FC<ApprovePaymentButtonProps> = ({ data, onRefresh }) => {
    const [loading, setLoading] = useState(false);

    const handleApprovePayment = async () => {
      if (!data?.id) return;
      setLoading(true);
      try {
        await updateShipmentStatus(data.id, "PAYMENT_APPROVED");
        onRefresh();
        toast.success("Payment approved successfully!");
      } catch (err) {
        console.error("Failed to approve payment:", err);
        toast.error("Failed to approve payment.");
      } finally {
        setLoading(false);
      }
    };

    return (
        <>  
            <Button
                variant="contained"
                onClick={handleApprovePayment}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                sx={{
                  bgcolor: "#a855f7",
                  "&:hover": { bgcolor: "#9333ea" },
                  textTransform: "none",
                  borderRadius: 1,
                }}
            >
                {loading ? "Approving..." : "Approve Payment"}
            </Button>
        </>
    )
}

export default ApprovePaymentButton;