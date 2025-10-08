import { Button } from "@mui/material"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ConfirmDialog from "../common/ConfirmDialog";
import { updatePackageStatus } from "../../services/api.services";
import type { PackageData } from "../../types";

interface DiscardButtonProps {
    data: PackageData;
}

const DiscardButton: React.FC<DiscardButtonProps> = ({ data }) => {
    const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleOpenDiscardDialog = () => {
      setDiscardDialogOpen(true);
    };

    const handleCloseDiscardDialog = () => {
      setDiscardDialogOpen(false);
    };

    const handleDiscard = async () => {
        if (!data.id) return;
        setLoading(true);
        try {
          await updatePackageStatus(data.id, "Discarded");
          toast.success("Package discarded successfully!");
          setDiscardDialogOpen(false);
          navigate("/packages");
        } catch (err) {
          console.error("Failed to discard package:", err);
          toast.error("Failed to discard package");
        } finally {
          setLoading(false);
        }
    };

    return (
        <>  
            <Button
                variant="contained"
                onClick={handleOpenDiscardDialog}
                sx={{
                    bgcolor: '#ef4444',
                    '&:hover': { bgcolor: '#dc2626' },
                    textTransform: 'none',
                    borderRadius: 1,
                }}
            >
                Discard
            </Button>

            <ConfirmDialog
              open={discardDialogOpen}
              onClose={handleCloseDiscardDialog}
              onConfirm={handleDiscard}
              title="Discard Package"
              message="Are you sure you want to discard this package? This action cannot be undone."
              confirmText="Discard"
              cancelText="Cancel"
              isLoading={loading}
            />
        </>
    )
}

export default DiscardButton;