import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, Stack, Button, CircularProgress } from "@mui/material";

import { createSubCategory, getCategories, updateSubCategory } from "../../services/api.services";
import type { SubCategoryPayload } from "../../types";

interface SubCategoryFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: SubCategoryPayload;
}

const statusOptions = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

const SubCategoryForm: React.FC<SubCategoryFormProps> = ({ onClose, onSuccess, initialData }) => {
  const [subCategories, setSubCategories] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    slug: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetchingSubCategories, setFetchingSubCategories] = useState(true);

  const fetchSubCategories = async () => {
    try {
      setFetchingSubCategories(true);
      const data = await getCategories();
      setSubCategories(data);
    } catch (err) {
      console.error("Failed to fetch sub categories:", err);
    } finally {
      setFetchingSubCategories(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  useEffect(() => {
    setFormData({
      category_id: initialData?.category_id || "",
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      is_active: initialData?.is_active ?? true,
    });
  }, [initialData]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const { category_id, name, slug, is_active } = formData;
    if (!name || !slug) return;

    if (initialData) {
      const hasChanged =
        initialData.category_id !== category_id ||
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
        await updateSubCategory(initialData.id, formData);
      } else {
        await createSubCategory(formData);
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
          label="Parent Category"
          select
          value={formData.category_id}
          onChange={(e) => handleChange("category_id", e.target.value)}
          fullWidth
          disabled={fetchingSubCategories}
        >
          {fetchingSubCategories ? (
            <MenuItem value="">
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            subCategories.map((subCategory) => (
              <MenuItem key={subCategory.id} value={subCategory.id}>
                {subCategory.name}
              </MenuItem>
            ))
          )}
        </TextField>

        <TextField
          label="Sub Category Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          fullWidth
        />

        <TextField
          label="Slug"
          value={formData.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
          helperText="URL-friendly version of the name"
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
            {loading ? <CircularProgress size={20} color="inherit" /> : initialData ? "Update" : "Add"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SubCategoryForm;
