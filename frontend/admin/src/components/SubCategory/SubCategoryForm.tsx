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
  const [category, setCategory] = useState("");  
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetchingCategories, setFetchingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setFetchingCategories(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setFetchingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category_id);
      setName(initialData.name);
      setSlug(initialData.slug);
      setStatus(initialData.is_active);
    } else {
      setCategory("");
      setName("");
      setSlug("");
      setStatus(true);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (!name || !slug) return;

    if (initialData) {
      const hasChanged =
        initialData.category_id !== category ||
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
        await updateSubCategory(initialData.id!, { category_id: category, name, slug, is_active: status });
      } else {
        await createSubCategory({ category_id: category, name, slug, is_active: status });
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
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
          disabled={fetchingCategories}
        >
          {fetchingCategories ? (
            <MenuItem value="">
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))
          )}
        </TextField>

        <TextField
          label="Sub Category Name"
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
          <Button variant="contained" onClick={handleSubmit} disabled={loading || !name || !slug}>
            {loading ? <CircularProgress size={20} color="inherit" /> : initialData ? "Update" : "Add"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SubCategoryForm;
