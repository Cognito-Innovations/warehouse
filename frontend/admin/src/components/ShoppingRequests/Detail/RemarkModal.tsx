import { Box, Typography } from "@mui/material";
import Modal from "../../common/Modal";

interface RemarkModalProps {
  open: boolean;
  onClose: () => void;
  remarks?: string;
}

const RemarkModal = ({ open, onClose, remarks }: RemarkModalProps) => {
  return (
    <Modal open={open} onClose={onClose} title="Remarks">
      <Box sx={{ p: 2 }}>
        {remarks ? (
          <Typography variant="body2">{remarks}</Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No remarks available
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default RemarkModal;
