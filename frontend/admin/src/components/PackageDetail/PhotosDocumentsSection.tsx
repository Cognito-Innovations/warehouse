import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { Upload as UploadIcon } from "@mui/icons-material";
import { toast } from "sonner";
import { uploadToCloudinary } from "../../utils/cloudinary.api";
import { addShipmentDocument, getShipmentDocuments } from "../../services/api.services";

interface PhotosDocumentsSectionProps {
  packageData: any;
  onUploadSuccess?: () => void;
}

const PhotosDocumentsSection: React.FC<PhotosDocumentsSectionProps> = ({ packageData, onUploadSuccess }) => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  async function fetchDocs() {
    try {
      const docs = await getShipmentDocuments(packageData.shipment_uuid);
      setUploadedUrls(docs.map((doc: any) => doc.document_url));
    } catch {
      console.error("Failed to fetch shipment documents");
    }
  }

  useEffect(() => {
    if (packageData.shipment_uuid) {
      fetchDocs();
    }
  }, [packageData.shipment_uuid]);

  const handleFileClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    const filesArray = Array.from(e.target.files);

    try {
      for (const file of filesArray) {
        const url = await uploadToCloudinary(file);
        if (url) {
          await addShipmentDocument(packageData.shipment_uuid, {
            url,
            original_filename: file.name,
            mime_type: file.type,
            file_size: file.size,
          });
          setUploadedUrls((prev) => [...prev, url]);
        }
      }
      toast.success("Files uploaded successfully");
      onUploadSuccess?.();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Photos / Documents
          </Typography>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            size="small"
            onClick={handleFileClick}
            sx={{
              bgcolor: "#3b82f6",
              "&:hover": { bgcolor: "#2563eb" },
              textTransform: "none",
            }}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 2 }}>
          {uploadedUrls.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No photo / document found
            </Typography>
          )}
          {uploadedUrls.map((url, index) => {
            const isImage = url.match(/\.(jpeg|jpg|png|gif|webp)$/i);
            const fileName = url.split("/").pop();

            return (
              <Box
                key={index}
                onClick={() => window.open(url, "_blank")}
                title={fileName}
                sx={{
                  width: 40,
                  height: 40,
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#f3f4f6",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
              >
                {isImage ? (
                  <img
                    src={url}
                    alt={fileName || `doc-${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography component="span" sx={{ fontSize: "1.5rem" }}>
                    📄
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
          accept="image/*,.pdf,.doc,.docx"
        />
      </CardContent>
    </Card>
  );
};

export default PhotosDocumentsSection;