import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, Stack, Button, CircularProgress, Chip } from "@mui/material";

import { createProduct, getCargoOptions, getCategories, getCountries, getMeasurements, getSubCategories, updateEcommerceProduct } from "../../services/api.services";
import ImageUpload from "../common/ImageUpload";
import { arraysEqual } from "../../utils/arrayEqual";
import { statusOptions } from "../../utils/constants";
import type { CargoOption, Country, ProductPayload } from "../../types";

export interface Category { id: string; name: string; }
interface SubCategoryItem { id: string; name: string; category: { id: string }; }
interface Measurement { id: string; label: string; }

interface ProductFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: ProductPayload;
}

const defaultFormData: ProductPayload = {
  id: undefined,
  category_id: "",
  sub_category_id: "",
  name: "",
  slug: "",
  description: "",
  image_url: "",
  price: 0,
  discount_percentage: 0,
  unit_value: 0,
  measurement_id: "",
  country_ids: [],
  cargo_option_id: "",
  stock_quantity: 0,
  is_active: true,
};

const ProductForm: React.FC<ProductFormProps> = ({ onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState<ProductPayload>(defaultFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubCategories, setAllSubCategories] = useState<SubCategoryItem[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategoryItem[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [cargoOptions, setCargoOptions] = useState<CargoOption[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchDropdownData = async () => {
    try {
      setFetching(true);
      const [catData, subCatData, countryData, measurementData, cargoOptionsData] =
        await Promise.all([
          getCategories(),
          getSubCategories(),
          getCountries(),
          getMeasurements(),
          getCargoOptions(),
        ]);
      setCategories(catData);
      setAllSubCategories(subCatData);
      setCountries(countryData);
      setMeasurements(measurementData);
      setCargoOptions(cargoOptionsData);
    } catch (err) {
      console.error("Failed to fetch dropdown data:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (initialData) {
      const updatedInitialData = {
        ...initialData,
        price: initialData.price,
        discount_percentage: Number(initialData.discount_percentage) || 0,
        unit_value: Number(initialData.unit_value) || 0,
        stock_quantity: Number(initialData.stock_quantity) || 0,
      };
      setFormData({ ...defaultFormData, ...updatedInitialData });
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData]);

  useEffect(() => {
    let filtered: SubCategoryItem[] = [];
    if (formData.category_id) {
      filtered = allSubCategories.filter(
        (sub) => sub.category?.id === formData.category_id
      );
    }
    setFilteredSubCategories(filtered);

    if ((!formData.category_id || !filtered.some((s) => s.id === formData.sub_category_id)) && allSubCategories.length > 0) {
      setFormData((prev) => ({ ...prev, sub_category_id: "" }));
    }
  }, [formData.category_id, allSubCategories]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountryDelete = (countryId: string) => {
    handleChange("country_ids", formData.country_ids.filter(id => id !== countryId));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug || !formData.image_url) return;

    if (initialData) {
      const hasChanged = Object.keys(defaultFormData).some((key) => {
        const k = key as keyof ProductPayload;

        if (k === "country_ids") {
          return !arraysEqual(initialData.country_ids || [], formData.country_ids);
        }

        if (k === "id") return false;

        return initialData[k] !== formData[k];
      });

      if (!hasChanged) {
        onClose();
        return;
      }
    }

    const payload: ProductPayload = {
      ...formData,
    };

    try {
      setLoading(true);
      if (initialData?.id) {
        const { id, ...updatePayload } = formData;
        await updateEcommerceProduct(initialData.id, updatePayload);
      } else {
        await createProduct(payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to save product:", err);
    } finally {
      setLoading(false);
    }
  };

  const allFieldsValid =
    formData.category_id &&
    formData.sub_category_id &&
    formData.name &&
    formData.slug &&
    formData.description &&
    formData.image_url &&
    formData.price > 0 &&
    formData.discount_percentage >= 0 &&
    formData.unit_value > 0 &&
    formData.measurement_id &&
    formData.cargo_option_id &&
    formData.country_ids.length > 0 &&
    formData.stock_quantity > 0;

  const loaderBox = (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress size={24} />
    </Box>
  );

  const categoryRenderValue = (selected: string) => {
    if (fetching) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '24px', pl: 1 }}>
          <CircularProgress size={20} />
        </Box>
      );
    }
    return categories.find(c => c.id === selected)?.name || '';
  };

  const subCategoryRenderValue = (selected: string) => {
    if (fetching || !formData.category_id) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '24px', pl: 1 }}>
          <CircularProgress size={20} />
        </Box>
      );
    }
    return filteredSubCategories.find(s => s.id === selected)?.name || '';
  };

  const measurementRenderValue = (selected: string) => {
    if (fetching) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '24px', pl: 1 }}>
          <CircularProgress size={20} />
        </Box>
      );
    }
    return measurements.find(m => m.id === selected)?.label || '';
  };

  const cargoOptionsRenderValue = (selected: string) => {
    if (fetching || !formData.cargo_option_id) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '24px', pl: 1 }}>
          <CircularProgress size={20} />
        </Box>
      );
    }
    return cargoOptions.find(cargoOption => cargoOption.id === selected)?.label || '';
  };

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          label="Category"
          select
          value={formData.category_id}
          onChange={(e) => handleChange("category_id", e.target.value)}
          fullWidth
          required
          disabled={fetching}
          SelectProps={{
            renderValue: categoryRenderValue,
          }}
        >
          {fetching ? loaderBox : categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Sub Category"
          select
          value={formData.sub_category_id}
          onChange={(e) => handleChange("sub_category_id", e.target.value)}
          fullWidth
          required
          disabled={fetching || !formData.category_id}
          helperText={!formData.category_id ? "Please select a category first" : ""}
          SelectProps={{
            renderValue: subCategoryRenderValue,
          }}
        >
          {(fetching || !formData.category_id) ? loaderBox : filteredSubCategories.map((subCategory) => (
            <MenuItem key={subCategory.id} value={subCategory.id}>{subCategory.name}</MenuItem>
          ))}
        </TextField>
      </Box>

      <TextField
        label="Product Name"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        fullWidth
        required
        sx={{ mb: 2.5 }}
      />

      <TextField
        label="Slug"
        value={formData.slug}
        onChange={(e) => handleChange("slug", e.target.value)}
        fullWidth
        required
        helperText="URL-friendly version of the name (e.g., sweet-mangoes)"
        sx={{ mb: 2.5 }}
      />

      <TextField
        label="Description"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        fullWidth
        required
        multiline
        rows={4}
        sx={{ mb: 2.5 }}
      />

      <ImageUpload
        value={formData.image_url}
        onChange={(url) => handleChange("image_url", url)}
        label="Product Image"
      />

      <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          label="Price (USD)"
          value={formData.price}
          onChange={(e) => {
            const numValue = parseFloat(e.target.value);
            handleChange("price", isNaN(numValue) ? 0 : numValue);
          }}
          fullWidth
          required
          type="number"
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
      </Box>

      <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          label="Unit Value"
          value={formData.unit_value}
          onChange={(e) => {
            const numValue = parseFloat(e.target.value);
            handleChange("unit_value", isNaN(numValue) ? 0 : numValue);
          }}
          fullWidth
          required
          type="number"
        />
        <TextField
          label="Unit Type"
          select
          value={formData.measurement_id}
          onChange={(e) => handleChange("measurement_id", e.target.value)}
          fullWidth
          required
          disabled={fetching}
          SelectProps={{
            renderValue: measurementRenderValue,
          }}
        >
          {fetching ? loaderBox : measurements.map((measurement) => (
            <MenuItem key={measurement.id} value={measurement.id}>{measurement.label}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
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
          {fetching ? loaderBox : countries.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Cargo Type"
          select
          value={formData.cargo_option_id}
          onChange={(e) => handleChange("cargo_option_id", e.target.value)}
          required
          fullWidth
          disabled={fetching}
          SelectProps={{
            renderValue: cargoOptionsRenderValue
          }}
        >
          {fetching ? loaderBox : cargoOptions.map((cargoOption) => (
            <MenuItem key={cargoOption.id} value={cargoOption.id}>{cargoOption.label}</MenuItem>
          ))}
        </TextField>
        
        <TextField
          label="Stock Quantity"
          value={formData.stock_quantity}
          onChange={(e) => {
            const numValue = parseFloat(e.target.value);
            handleChange("stock_quantity", isNaN(numValue) ? 0 : numValue);
          }}
          fullWidth
          required
          type="number"
        />
      </Box>

      <TextField
        label="Status"
        select
        value={String(formData.is_active)}
        onChange={(e) => handleChange("is_active", e.target.value === "true")}
        fullWidth
        required
      >
        {statusOptions.map((option) => (
          <MenuItem key={option.label} value={String(option.value)}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || fetching || !allFieldsValid}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : (initialData ? "Update Product" : "Add Product")}
        </Button>
      </Stack>
    </Box>
  );
};

export default ProductForm;