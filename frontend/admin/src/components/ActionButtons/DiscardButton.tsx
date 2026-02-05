import { Button } from "@mui/material"
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { updatePackageStatus } from "../../services/api.services";
import DiscardDialog from "../common/DiscardDialog";
import type { PackageData } from "../../types";

interface DiscardButtonProps {
  data: PackageData;
}

const DiscardButton: React.FC<DiscardButtonProps> = ({ data }) => {
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDiscard = async (comment: string) => {
    if (!data.id) return;
    setLoading(true);
    try {
      await updatePackageStatus(data.id, "Discarded", comment);
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
        onClick={() => setDiscardDialogOpen(true)}
        sx={{
            bgcolor: '#ef4444',
            '&:hover': { bgcolor: '#dc2626' },
            textTransform: 'none',
            borderRadius: 1,
        }}
      >
        Discard
      </Button>

      <DiscardDialog
        open={discardDialogOpen}
        onClose={() => setDiscardDialogOpen(false)}
        onConfirm={handleDiscard}
        loading={loading}
      />
    </>
  )
}

export default DiscardButton;