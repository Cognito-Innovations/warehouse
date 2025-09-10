import { Box, Typography } from "@mui/material";
import { type InvoiceDetails } from "./InvoiceRow";

export default function InvoiceSlips({ slips }: { slips?: InvoiceDetails["payment_slips"] }) {
  return (
    <Box mt={2} mb={2}>
      <Box display="flex" gap={1.5} flexWrap="wrap">
        {slips?.length ? (
          slips.map((slip, i) => {
            const url = slip.document_url;
            const isImage = url.match(/\.(jpeg|jpg|png|gif|webp)$/i);
            return (
              <Box
                key={slip.id || i}
                onClick={() => window.open(url, "_blank")}
                title={slip.original_filename || `Slip ${i + 1}`}
                sx={{
                  width: 50,
                  height: 50,
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
                    alt={`Slip-${i}`}
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
          })
        ) : (
          <Typography variant="body2" color="text.secondary">
            No payment slips uploaded yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
