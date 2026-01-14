import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, Stack, Button, CircularProgress,
  // Chip
} from "@mui/material";

import { createSubCategory, getCategories,
  // getCountries,
  updateSubCategory } from "../../services/api.services";
// import ImageUpload from "../common/ImageUpload";
// import { arraysEqual } from "../../utils/arrayEqual";
import { statusOptions } from "../../utils/constants";
import type { Category } from "../Product/ProductForm";
import type {
  // Country,
  SubCategoryPayload } from "../../types";

interface SubCategoryFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: SubCategoryPayload;
}

const defaultFormData: SubCategoryPayload = {
  id: undefined,
  category_id: "",
  name: "",
  slug: "",
  discount_percentage: 0,
  // country_ids: [],
  is_active: true,
  // image_url: "",
};

const SubCategoryForm: React.FC<SubCategoryFormProps> = ({ onClose, onSuccess, initialData }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  // const [countries, setCountries] = useState<Country[]>([]);
  const [formData, setFormData] = useState<SubCategoryPayload>(defaultFormData);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchDropdownData = async () => {
    try {
      setFetching(true);
      const [categoriesData,
        // countryData
      ] = await Promise.all([
        getCategories(),
        // getCountries(),
      ]);
      setCategories(categoriesData);
      // setCountries(countryData);
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
    if (initialData) {
      setFormData({ ...defaultFormData, ...initialData });
    } else {
      setFormData(defaultFormData)
    }
  }, [initialData]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // const handleCountryDelete = (countryId: string) => {
  //   handleChange("country_ids", formData.country_ids.filter(id => id !== countryId));
  // };

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug 
      // || !formData.image_url
    ) return;

    if (initialData) {
      const hasChanged = Object.keys(defaultFormData).some((key) => {
        const k = key as keyof SubCategoryPayload;

        // if (k === "country_ids") {
        //   return !arraysEqual(initialData.country_ids || [], formData.country_ids);
        // }

        return initialData[k] !== formData[k];
      })

      if (!hasChanged) {
        onClose();
        return;
      }
    }

    try {
      setLoading(true);
      if (initialData?.id) {
        const { id, ...updatePayload } = formData;
        await updateSubCategory(initialData.id, updatePayload);
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

        {/* <ImageUpload
          value={formData.image_url}
          onChange={(url) => handleChange("image_url", url)}
          label="Sub Category Image"
        /> */}

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

        {/* TODO: Uncomment the country selection when it's required */}
        {/* <TextField
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
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '24px', pl: 1 }}>
                    <CircularProgress size={20} />
                  </Box>
                );
              }

              return (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            countries.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))
          )}
        </TextField> */}

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
            disabled={loading || !formData.name || !formData.slug 
              // || !formData.image_url
            }
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : initialData ? "Update" : "Add"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default SubCategoryForm;
