import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, Stack, Button, CircularProgress, Chip } from "@mui/material";

import { createCategory, getCountries, updateCategory } from "../../services/api.services";
import ImageUpload from "../common/ImageUpload";
import { arraysEqual } from "../../utils/arrayEqual";
import { statusOptions } from "../../utils/constants";
import type { CategoryPayload, Country } from "../../types";

interface CategoryFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: CategoryPayload;
}

const defaultFormData: CategoryPayload = {
  id: undefined,
  name: "",
  slug: "",
  discount_percentage: 0,
  country_ids: [],
  is_active: true,
  image_url: "",
  description: "",
};

const CategoryForm: React.FC<CategoryFormProps> = ({ onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState<CategoryPayload>(defaultFormData);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchCountries = async () => {
    try {
      setFetching(true);
      const countries = await getCountries();
      setCountries(countries);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({ ...defaultFormData, ...initialData });
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData]);

  const handleChange = (key: keyof CategoryPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCountryDelete = (countryId: string) => {
    handleChange("country_ids", formData.country_ids.filter(id => id !== countryId));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug || !formData.image_url) return;

    if (initialData) {
      const hasChanged = Object.keys(defaultFormData).some((key) => {
        const k = key as keyof CategoryPayload;

        if (k === "country_ids") {
          return !arraysEqual(initialData.country_ids || [], formData.country_ids);
        }

        return initialData[k] !== formData[k];
      });

      if (!hasChanged) {
        onClose();
        return;
      }
    }

    try {
      setLoading(true);
      if (initialData?.id) {
        const { id, ...updatePayload } = formData;
        await updateCategory(id!, updatePayload);
      } else {
        await createCategory(formData);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to save category:", err);
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
        <ImageUpload
          value={formData.image_url}
          onChange={(url) => handleChange("image_url", url)}
          label="Category Image"
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
            const numValue = parseFloat(e.target.value);
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
            renderValue: (selected) => {
              const selectedIds = selected as string[];

              if (fetching && selectedIds.length > 0) {
                return (
                  <Box sx={{ display: "flex", alignItems: "center", height: "24px", pl: 1 }}>
                    <CircularProgress size={20} />
                  </Box>
                );
              }

              return (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selectedIds.map((value) => {
                    const countryName = countries.find(c => c.id === value)?.name || value;
                    return (
                      <Chip
                        key={value}
                        label={countryName}
                        onMouseDown={(e) => e.stopPropagation()}
                        onDelete={(e) => {
                          e.stopPropagation();
                          handleCountryDelete(value);
                        }}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    );
                  })}
                </Box>
              );
            },
          }}
        >
          {fetching ? (
            <Box sx={{ p: 2, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            countries.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))
          )}
        </TextField>

        <TextField
          label="Status"
          select
          value={String(formData.is_active)}
          onChange={(e) => handleChange("is_active", e.target.value === "true")}
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
            disabled={loading || !formData.name || !formData.slug || !formData.image_url}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : (initialData ? "Update" : "Add")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CategoryForm;
