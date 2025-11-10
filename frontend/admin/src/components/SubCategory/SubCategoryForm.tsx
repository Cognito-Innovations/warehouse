import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, Stack, Button, CircularProgress, Chip } from "@mui/material";

import { createSubCategory, getCategories, getCountries, updateSubCategory } from "../../services/api.services";
import type { Country, SubCategoryPayload } from "../../types";
import type { Category } from "../Product/ProductForm";
import { arraysEqual } from "../../utils/arrayEqual";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    slug: "",
    discount_percentage: 0,
    country_ids: [] as string[],
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchDropdownData = async () => {
    try {
      setFetching(true);
      const [categoriesData, countryData] = await Promise.all([
        getCategories(),
        getCountries(),
      ]);
      setCategories(categoriesData);
      setCountries(countryData);
    } catch (error) {
      console.error("Failed to fetch dropdown data:", error);
    } finally {
      setFetching(false);
    }
  }
  
  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    setFormData({
      category_id: initialData?.category_id || "",
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      discount_percentage: initialData?.discount_percentage || 0,
      country_ids: initialData?.country_ids || [],
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
        initialData.discount_percentage ||
        !arraysEqual(initialData.country_ids || [], formData.country_ids) ||
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
          disabled={fetching}
        >
          {fetching ? (
            <MenuItem value="">
              <CircularProgress size={20} />
            </MenuItem>
          ) : (
            categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
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
          label="Discount (%)"
          value={formData.discount_percentage}
          onChange={(e) => {
            const value = e.target.value;
            const numValue = parseFloat(value);
            handleChange("discount_percentage", isNaN(numValue) ? 0 : numValue);
          }}
          fullWidth
          required
          type="number"
        />

        <TextField
          label="Countries"
          select
          value={formData.country_ids}
          onChange={(e) => handleChange("country_ids", e.target.value)}
          fullWidth
          required
          disabled={fetching}
          SelectProps={{
            multiple: true,
            renderValue: (selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((value) => {
                  const countryName = countries.find(c => c.id === value)?.name || value;
                  return <Chip key={value} label={countryName} />;
                })}
              </Box>
            ),
          }}
        >
          {countries.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
          ))}
        </TextField>

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
