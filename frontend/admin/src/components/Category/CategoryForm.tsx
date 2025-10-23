import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, Stack, Button, CircularProgress } from "@mui/material";

import { createCategory, updateCategory } from "../../services/api.services";
import type { CategoryPayload } from "../../types";

interface CategoryFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: CategoryPayload;
}

const statusOptions = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

const CategoryForm: React.FC<CategoryFormProps> = ({ onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      is_active: initialData?.is_active ?? true,
    });
  }, [initialData]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const { name, slug, is_active } = formData;
    if (!name || !slug) return;

    if (initialData) {
      const hasChanged =
        initialData.name !== name ||
        initialData.slug !== slug ||
        initialData.is_active !== is_active;

      if (!hasChanged) {
        onClose();
        return;
      }
    }

    try {
      setLoading(true);
      if (initialData?.id) {
        await updateCategory(initialData.id, formData);
      } else {
        await createCategory(formData);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to create category:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
      <Stack spacing={2}>
        <TextField
          label="Category Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Slug"
          value={formData.slug}
          helperText="URL-friendly version of the name"
          onChange={(e) => handleChange("slug", e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Status"
          select
          value={formData.is_active}
          onChange={(e) => handleChange("is_active", e.target.value === "true")}
          fullWidth
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 1 }}>
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !formData.name || !formData.slug}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : (initialData ? "Update" : "Add")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CategoryForm;
