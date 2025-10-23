import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, Stack, Button, CircularProgress } from "@mui/material";

import { createProduct, getCategories, getCountries, getMeasurements, getSubCategories } from "../../services/api.services";
import type { Country, ProductPayload } from "../../types";

export interface Category { id: string; name: string; }
interface SubCategoryItem { id: string; name: string; category: { id: string }; }
interface Measurement { id: string; label: string; }

interface ProductFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const statusOptions = [
  { label: "Active", value: true },
  { label: "Inactive", value: false },
];

const ProductForm: React.FC<ProductFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    category_id: "",
    sub_category_id: "",
    name: "",
    slug: "",
    description: "",
    image_url: "",
    price: "",
    discount_percentage: "",
    unit_value: "",
    measurement_id: "",
    country_id: "",
    stock_quantity: "",
    is_active: true,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [allSubCategories, setAllSubCategories] = useState<SubCategoryItem[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategoryItem[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchDropdownData = async () => {
    try {
      setFetching(true);
      const [catData, subCatData, countryData, measurementData] =
        await Promise.all([
          getCategories(),
          getSubCategories(),
          getCountries(),
          getMeasurements(),
        ]);
      setCategories(catData);
      setAllSubCategories(subCatData);
      setCountries(countryData);
      setMeasurements(measurementData);
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
    if (formData.category_id) {
      const filtered = allSubCategories.filter(
        (sub) => sub.category?.id === formData.category_id
      );
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
    setFormData((prev) => ({ ...prev, sub_category_id: "" }));
  }, [formData.category_id, allSubCategories]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const { price, discount_percentage, unit_value, stock_quantity } = formData;

    const payload: ProductPayload = {
      ...formData,
      price: Number(price),
      discount_percentage: Number(discount_percentage),
      unit_value: Number(unit_value),
      stock_quantity: Number(stock_quantity),
    };

    try {
      setLoading(true);
      await createProduct(payload);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Failed to create product:", err);
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
    Number(formData.price) > 0 &&
    Number(formData.discount_percentage) > 0 &&
    Number(formData.unit_value) > 0 &&
    formData.measurement_id &&
    formData.country_id &&
    Number(formData.stock_quantity) > 0;

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
        >
          {categories.map((category) => (
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
        >
          {filteredSubCategories.map((subCategory) => (
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

      <TextField
        label="Image URL"
        value={formData.image_url}
        onChange={(e) => handleChange("image_url", e.target.value)}
        fullWidth
        required
        sx={{ mb: 2.5 }}
      />

      <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          label="Price (USD)"
          value={formData.price}
          onChange={(e) => handleChange("price", e.target.value)}
          fullWidth
          required
          type="number"
        />
        <TextField
          label="Discount (%)"
          value={formData.discount_percentage}
          onChange={(e) => handleChange("discount_percentage", e.target.value)}
          fullWidth
          required
          type="number"
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          label="Unit Value"
          value={formData.unit_value}
          onChange={(e) => handleChange("unit_value", e.target.value)}
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
        >
          {measurements.map((measurement) => (
            <MenuItem key={measurement.id} value={measurement.id}>{measurement.label}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          label="Country"
          select
          value={formData.country_id}
          onChange={(e) => handleChange("country_id", e.target.value)}
          fullWidth
          required
          disabled={fetching}
        >
          {countries.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Stock Quantity"
          value={formData.stock_quantity}
          onChange={(e) => handleChange("stock_quantity", e.target.value)}
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
          {loading ? <CircularProgress size={20} color="inherit" /> : "Add Product"}
        </Button>
      </Stack>
    </Box>
  );
};

export default ProductForm;