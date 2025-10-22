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
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSlug(initialData.slug);
      setStatus(initialData.is_active);
    } else {
      setName("");
      setSlug("");
      setStatus(true);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!name || !slug) return;

    if (initialData) {
      const hasChanged =
        initialData.name !== name ||
        initialData.slug !== slug ||
        initialData.is_active !== status;

      if (!hasChanged) {
        onClose();
        return;
      }
    }

    try {
      setLoading(true);
      if (initialData) {
        await updateCategory(initialData.id!, { name, slug, is_active: status });
      } else {
        await createCategory({ name, slug, is_active: status });
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Slug"
          value={slug}
          helperText="URL-friendly version of the name"
          onChange={(e) => setSlug(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Status"
          select
          value={status}
          onChange={(e) => setStatus(e.target.value === "true")}
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
            disabled={loading || !name || !slug}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : (initialData ? "Update" : "Add")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CategoryForm;
