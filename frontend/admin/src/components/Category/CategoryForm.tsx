import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, Stack, Button, CircularProgress, Chip } from "@mui/material";

import { createCategory, getCountries, updateCategory } from "../../services/api.services";
import type { CategoryPayload, Country } from "../../types";
import { arraysEqual } from "../../utils/arrayEqual";

interface CategoryFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: CategoryPayload;
}

const statusOptions = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

const cargoTypeOptions = [
  { label: "Perishable goods", value: "Perishable goods" },
  { label: "Animal cargo", value: "Animal cargo" },
  { label: "General courier", value: "General courier" },
  { label: "General cargo", value: "General cargo" },
];

const CategoryForm: React.FC<CategoryFormProps> = ({ onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    discount_percentage: 0,
    country_ids: [] as string[],
    is_active: true,
    image_url: "",
    cargo_type: "",
    description: "",
  });
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchCountries = async () => {
    try {
      setFetching(true);
      const countries = await getCountries();
      setCountries(countries)
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      discount_percentage: initialData?.discount_percentage || 0,
      country_ids: initialData?.country_ids || [],
      is_active: initialData?.is_active ?? true,
      image_url: initialData?.image_url || "",
      cargo_type: initialData?.cargo_type || "",
      description: initialData?.description || "",
    });
  }, [initialData]);

  const handleChange = (key: keyof typeof formData, value: typeof formData[keyof typeof formData]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const { name, slug, is_active, cargo_type, image_url, description } = formData;
    if (!name || !slug) return;

    if (initialData) {
      const hasChanged =
        initialData.name !== name ||
        initialData.slug !== slug ||
        initialData.discount_percentage ||
        !arraysEqual(initialData.country_ids || [], formData.country_ids) ||
        initialData.is_active !== is_active ||
        initialData.cargo_type !== cargo_type ||
        initialData.image_url !== image_url ||
        initialData.description !== description;

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
          label="Image URL"
          value={formData.image_url}
          onChange={(e) => handleChange("image_url", e.target.value)}
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
          label="Cargo Type"
          select
          value={formData.cargo_type}
          onChange={(e) => handleChange("cargo_type", e.target.value)}
          required
          fullWidth
        >
          {cargoTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Status"
          select
          value={formData.is_active}
          onChange={(e) => handleChange("is_active", e.target.value === "true" ? true : false)}
          fullWidth
        >
          {statusOptions.map((option) => (
            <MenuItem key={option.label} value={String(option.value)}>
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
