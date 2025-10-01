import { 
  Box, 
  Typography, 
  Chip,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

export default function InvoiceSlips({ slips }: { slips?: any[] }) {
  if (!slips?.length) {
    return (
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
          Payment Slips
        </Typography>
        <Card variant="outlined" sx={{ bgcolor: "grey.50" }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No payment slips uploaded yet.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Typography variant="subtitle1" fontWeight="bold" color="primary">
          Payment Slips
        </Typography>
        <Chip 
          label={`${slips.length} file${slips.length > 1 ? 's' : ''}`}
          color="primary"
          variant="outlined"
          size="small"
        />
      </Box>
      
      <Box display="flex" gap={2} flexWrap="wrap">
        {slips.map((slip, i) => {
          const url = slip.document_url || slip.url || slip;
          const filename = slip.original_filename || slip.name || `Slip ${i + 1}`;
          const isImage = url.match(/\.(jpeg|jpg|png|gif|webp)$/i);
          
          return (
            <Card
              key={slip.id || i}
              variant="outlined"
              sx={{
                width: 120,
                height: 120,
                cursor: "pointer",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                  borderColor: "primary.main",
                },
              }}
            >
              <CardContent 
                sx={{ 
                  p: 1, 
                  height: "100%", 
                  display: "flex", 
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
                onClick={() => window.open(url, "_blank")}
              >
                {isImage ? (
                  <Box
                    component="img"
                    src={url}
                    alt={filename}
                    sx={{
                      width: "100%",
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 0.5,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "primary.light",
                      borderRadius: 1,
                      color: "primary.contrastText",
                    }}
                  >
                    <Typography variant="h4">📄</Typography>
                  </Box>
                )}
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    mt: 1, 
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%",
                  }}
                  title={filename}
                >
                  {filename}
                </Typography>
                
                {/* Action buttons */}
                <Box 
                  sx={{ 
                    position: "absolute",
                    top: 4,
                    right: 4,
                    display: "flex",
                    gap: 0.5,
                    opacity: 0,
                    transition: "opacity 0.2s ease-in-out",
                    "&:hover": { opacity: 1 },
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "0";
                  }}
                >
                  <Tooltip title="View">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(url, "_blank");
                      }}
                      sx={{ 
                        bgcolor: "white",
                        "&:hover": { bgcolor: "grey.100" },
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = filename;
                        link.click();
                      }}
                      sx={{ 
                        bgcolor: "white",
                        "&:hover": { bgcolor: "grey.100" },
                      }}
                    >
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
