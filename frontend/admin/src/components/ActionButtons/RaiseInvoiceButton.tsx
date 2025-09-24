import { Button } from "@mui/material"
import { useState } from "react";
import Modal from "../common/Modal";
import RaiseInvoiceModal from "../PackageDetail/RaiseInvoiceModal";

interface RaiseInvoiceButtonProps {
    data: any;
    onRefresh: () => void;
}

const RaiseInvoiceButton: React.FC<RaiseInvoiceButtonProps> = ({ data, onRefresh }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <>  
            <Button
                variant="contained"
                onClick={handleOpen}
                sx={{
                  bgcolor: "#a855f7",
                  "&:hover": { bgcolor: "#9333ea" },
                  textTransform: "none",
                  borderRadius: 1,
                }}
            >
                Raise Invoice
            </Button>

            <Modal open={open} onClose={handleClose} title="Raise Invoice" size="md">
              <RaiseInvoiceModal
                packageData={data}
                onClose={handleClose}
                onUpdated={onRefresh}
              />
            </Modal>
        </>
    )
}

export default RaiseInvoiceButton;