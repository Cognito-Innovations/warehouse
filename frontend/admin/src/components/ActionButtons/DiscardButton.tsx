import { Button } from "@mui/material"
import { DeleteIcon } from "lucide-react"
import { useState } from "react";

const DiscardButton = () => {
    //TODO: Needs to implement the popup correctly
    const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
    const handleDiscard = () => {
        setDiscardDialogOpen(true);
    };
    return (
        <>  
        
        {/* TODO: Popup needs to be implemented by importing it like below
        {discardDialogOpen && <ConfirmDialog
            open={discardDialogOpen}
            onClose={() => setDiscardDialogOpen(false)}
            onConfirm={handleDiscard}
        />} */}
        <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={handleDiscard}
            sx={{
                bgcolor: '#ef4444',
                '&:hover': { bgcolor: '#dc2626' },
                textTransform: 'none',
                borderRadius: 1,
            }}
        >
            Discard
        </Button>
        </>
    )
}

export default DiscardButton;