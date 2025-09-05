import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { updateShoppingRequestStatus } from "../../../services/api.services";

interface PaymentSlipsCardProps {
  details: string[];
  onStatusUpdated: () => void;
}

const PaymentSlipsCard: React.FC<PaymentSlipsCardProps> = ({ details, onStatusUpdated }) => {
  const [expanded, setExpanded] = useState(false);
  const [approving, setApproving] = useState(false);

  const handleApprove = async () => {
    try {
      setApproving(true);
      await updateShoppingRequestStatus(details.id, "PAYMENT_APPROVED");
      onStatusUpdated();
    } catch (err) {
      console.error("Error approving payment:", err);
    } finally {
      setApproving(false);
    }
  };

  return (
    <Card sx={{ mb: 2, mt: 2 }}>
      <CardHeader
        title={
          <Typography variant="subtitle1" fontWeight={600}>
            Payment Slips
          </Typography>
        }
        subheader="Uploaded payment slips from customer"
        action={
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        }
      />

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Box
            sx={{
              border: "2px dashed",
              borderColor: "grey.300",
              borderRadius: 2,
              p: 2,
              mt: 1,
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            {details.payment_slips?.map((url, index) => {
              const isImage = url.match(/\.(jpeg|jpg|png|gif|webp)$/i);

              return (
                <Box
                  key={index}
                  onClick={() => window.open(url, "_blank")}
                  title={`Payment slip ${index + 1}`}
                  sx={{
                    width: 40,
                    height: 40,
                    border: "1px solid",
                    borderColor: "grey.300",
                    borderRadius: 1,
                    bgcolor: "grey.100",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    "&:hover": { bgcolor: "grey.200" },
                  }}
                >
                  {isImage ? (
                    <Box
                      component="img"
                      src={url}
                      alt={`Slip-${index}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Typography variant="caption">📄</Typography>
                  )}
                </Box>
              );
            })}
          </Box>

         {details.status === "PAYMENT_PENDING" && (
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleApprove}
                disabled={approving}
              >
                {approving ? "Approving..." : "Approve Payment"}
              </Button>
            </Box>
         )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default PaymentSlipsCard;