import React, { useEffect, useState } from "react";
import PackageInfoModal from "./PackageInfoModal";
import type { Rack, Supplier, User } from "../../types";
import { createPackage, getRacks, getSuppliers, getUsers } from "../../services/api.services";
import { toast } from "sonner";

import { Close as CloseIcon } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton, Divider, Grid, Box, CircularProgress } from "@mui/material";
import FormFields from "./RegisterPackageModal/FormFields";

import WeightSection from "./RegisterPackageModal/WeightSection";
import OptionsSection from "./RegisterPackageModal/OptionsSection";
import AddSupplierModal from "./RegisterPackageModal/AddSupplierModal";

interface RegisterPackageModalProps {
  open: boolean;
  onClose: () => void;
  onPackageCreated?: () => void;
}

const RegisterPackageModal: React.FC<RegisterPackageModalProps> = ({ open, onClose, onPackageCreated }) => {
  const [formData, setFormData] = useState({
    customer: "",
    rackSlot: "",
    trackingNo: "",
    vendor: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    volumetricWeight: "",
    allowCustomerItems: false,
    shopInvoiceReceived: false,
    remarks: "",
  });

  // pieces array: each piece has actual weight + volumetric dimensions + vol weight
  const [pieces, setPieces] = useState([
    { weight: "", length: "", width: "", height: "", volumetricWeight: "" },
  ]);

  const [users, setUsers] = useState<User[]>([]);
  const [racks, setRacks] = useState<Rack[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [packageInfoOpen, setPackageInfoOpen] = useState(false);
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchRacks = async () => {
    try {
      const data = await getRacks();
      setRacks(data);
    } catch (err) {
      console.error("Failed to fetch racks", err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (err) {
      console.error("Failed to fetch suppliers", err);
    }
  };

  const loadInitialData = async () => {
    setIsLoadingData(true);
    try {
      await Promise.all([fetchUsers(), fetchRacks(), fetchSuppliers()]);
    } catch (error) {
      console.error("Failed to load initial data for modal", error);
      toast.error("Could not load required data. Please try again.");
      onClose();
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadInitialData();
    }
  }, [open]);

  // Reset form data when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        customer: "",
        rackSlot: "",
        trackingNo:"",
        vendor: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        volumetricWeight: "",
        allowCustomerItems: false,
        shopInvoiceReceived: false,
        remarks: "",
      });
      setPieces([
        { weight: "", length: "", width: "", height: "", volumetricWeight: "" },
      ]);
      setErrors({});
    }
  }, [open]);

  const handleSubmit = async () => {
    // Validate required fields
    const newErrors: { [key: string]: string } = {};

    if (!formData.customer) {
      newErrors.customer = "Select Customer is required";
    }
    if (!formData.rackSlot) {
      newErrors.rackSlot = "Rack Slot is required";
    }
    if (!formData.vendor) {
      newErrors.vendor = "Select Vendor is required";
    }
    if (!formData.trackingNo) {
      newErrors.trackingNo = "Reference Tracking is required";
    }
    if (!/^\d{1,13}$/.test(formData.trackingNo)) {
      newErrors.trackingNo = "Tracking number must be digits only and less than 14 digits";
    }

    // Check if at least one piece has weight
    pieces.forEach((piece, idx) => {
      if (!piece.weight || parseFloat(piece.weight) <= 0) {
        newErrors[`piece_${idx}_weight`] = "Weight is required";
      }

      const hasSomeDimension = piece.length || piece.width || piece.height;
      const hasAllDimensions = piece.length && piece.width && piece.height;

      if (hasSomeDimension && !hasAllDimensions) {
        if (!piece.length) {
          newErrors[`piece_${idx}_length`] = "Length is required.";
        }
        if (!piece.width) {
          newErrors[`piece_${idx}_width`] = "Width is required.";
        }
        if (!piece.height) {
          newErrors[`piece_${idx}_height`] = "Height is required.";
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate total weight from pieces
      const totalWeight = pieces.reduce((sum, piece) => {
        return sum + (parseFloat(piece.weight) || 0);
      }, 0);

      // Calculate total volumetric weight from pieces
      const totalVolWeight = pieces.reduce((sum, piece) => {
        const volWeight = calculateVolumetricWeight(piece.length, piece.width, piece.height);
        return sum + (parseFloat(volWeight) || 0);
      }, 0);

      const payload = {
        user: formData.customer,
        rack_slot: formData.rackSlot,
        tracking_no: formData.trackingNo,
        vendor: formData.vendor,
        weight: totalWeight.toString(),
        length: pieces[0]?.length || "",
        width: pieces[0]?.width || "",
        height: pieces[0]?.height || "",
        volumetric_weight: totalVolWeight.toString(),
        allow_user_items: formData.allowCustomerItems,
        shop_invoice_received: formData.shopInvoiceReceived,
        remarks: formData.remarks,
        pieces: pieces.map(piece => ({
          weight: piece.weight,
          length: piece.length,
          width: piece.width,
          height: piece.height,
          volumetric_weight: piece.volumetricWeight
        }))
      };

      await createPackage(payload);
      toast.success("Package registered successfully!");
      onPackageCreated?.(); // Refresh the data
      onClose();
    } catch (err) {
      console.error("Failed to register package", err);
      toast.error("Failed to register package. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    // Validate that the value exists in the available options for select fields
    if (field === "customer" && typeof value === "string") {
      if (value && !users.some(user => user.id === value)) {
        return; // Don't set invalid customer value
      }
    }
    if (field === "rackSlot" && typeof value === "string") {
      if (value && !racks.some(rack => rack.id === value)) {
        return; // Don't set invalid rack value
      }
    }
    if (field === "vendor" && typeof value === "string") {
      if (value && !suppliers.some(supplier => supplier.id === value)) {
        return; // Don't set invalid vendor value
      }
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePieceChange = (index: number, field: string, value: string) => {
    setPieces((prev) => {
      const next = [...prev];
      const updatedPiece = { ...next[index], [field]: value };
      next[index] = updatedPiece;

      // Auto-calculate volumetric weight when dimensions change
      if (['length', 'width', 'height'].includes(field)) {
        const volWeight = calculateVolumetricWeight(updatedPiece.length, updatedPiece.width, updatedPiece.height);
        updatedPiece.volumetricWeight = volWeight;
      }
      return next;
    });
    const isVolumetricField = ['length', 'width', 'height'].includes(field);
  
    const changedPiece = { ...pieces[index], [field]: value };
    const areAllVolumetricFieldsEmpty = !changedPiece.length && !changedPiece.width && !changedPiece.height;

    if (isVolumetricField && areAllVolumetricFieldsEmpty) {
      setErrors((prev) => ({
        ...prev,
        [`piece_${index}_length`]: "",
        [`piece_${index}_width`]: "",
        [`piece_${index}_height`]: "",
      }));
    } else {
      const errorKey = `piece_${index}_${field}`;
      if (errors[errorKey]) {
        setErrors((prev) => ({ ...prev, [errorKey]: "" }));
      }
    }
  };

  const handleAddPiece = () => {
    setPieces((prev) => [
      ...prev,
      { weight: "", length: "", width: "", height: "", volumetricWeight: "" },
    ]);
  };

  const handleRemovePiece = (index: number) => {
    if (pieces.length > 1) {
      setPieces((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  const calculateVolumetricWeight = (length: string, width: string, height: string) => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const h = parseFloat(height) || 0;

    if (l > 0 && w > 0 && h > 0) {
      // Standard volumetric weight calculation: (L × W × H) / 5000 (for cm to kg)
      return ((l * w * h) / 5000).toFixed(2);
    }
    return "0.00";
  };

  const calculateTotals = () => {
    const totalWeight = pieces.reduce((sum, piece) => {
      return sum + (parseFloat(piece.weight) || 0);
    }, 0);

    const totalVolWeight = pieces.reduce((sum, piece) => {
      const volWeight = calculateVolumetricWeight(piece.length, piece.width, piece.height);
      return sum + (parseFloat(volWeight) || 0);
    }, 0);

    return {
      totalWeight: totalWeight.toFixed(2),
      totalVolWeight: totalVolWeight.toFixed(2)
    };
  };

  const handleAddSupplier = () => {
    setAddSupplierOpen(true);
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <Dialog 
        open={open} 
        onClose={isSubmitting ? undefined : onClose} 
        maxWidth="md" 
        fullWidth 
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2 }}>
        <Typography component="span" sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
          Register Package
        </Typography>
        <IconButton onClick={onClose} size="small" disabled={isSubmitting}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3, minHeight: "400px" }}>
        {isLoadingData ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2}>
              <FormFields
                formData={formData}
                errors={errors}
                users={users}
                racks={racks}
                suppliers={suppliers}
                onInputChange={handleInputChange}
                onAddSupplier={handleAddSupplier}
              />

              <WeightSection
                pieces={pieces}
                onPieceChange={handlePieceChange}
                onAddPiece={handleAddPiece}
                onRemovePiece={handleRemovePiece}
                calculateTotals={calculateTotals}
                errors={errors}
              />
            </Grid>
          )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={isSubmitting}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={isSubmitting}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            bgcolor: "#8b5cf6",
            px: 4,
            "&:hover": { bgcolor: "#7c3aed" },
            "&:disabled": { bgcolor: "#d1d5db" },
          }}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <Box
                component="span"
                sx={{
                  width: 16,
                  height: 16,
                  border: "2px solid #ffffff",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  mr: 1,
                }}
              />
              Registering...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </DialogActions>

      {/* Package Info Modal */}
      <PackageInfoModal
        open={packageInfoOpen}
        onClose={() => setPackageInfoOpen(false)}
      />

      {/* Add Supplier Modal */}
      <AddSupplierModal
        open={addSupplierOpen}
        onClose={() => setAddSupplierOpen(false)}
        onSupplierCreated={() => {
          fetchSuppliers(); // Refresh suppliers list
          setAddSupplierOpen(false);
        }}
      />
    </Dialog>
    </>
  );
};

export default RegisterPackageModal;
