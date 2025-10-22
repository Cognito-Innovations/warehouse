import React, { useEffect, useState } from "react";
import { Box, TextField, MenuItem, Stack, Button, CircularProgress } from "@mui/material";

import { createProduct, getCategories, getCountries, getMeasurements, getSubCategories } from "../../services/api.services";
import type { Country, ProductPayload } from "../../types";

interface Category { id: string; name: string; }
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
  const [category_id, setCategoryId] = useState("");
  const [sub_category_id, setSubCategoryId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | string>("");
  const [discount, setDiscount] = useState<number | string>("");
  const [unit_value, setUnitValue] = useState<number | string>("");
  const [measurement_id, setMeasurementId] = useState("");
  const [country_id, setCountryId] = useState("");
  const [stock_quantity, setStockQuantity] = useState<number | string>("");
  const [is_active, setIsActive] = useState(true);

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
    if (category_id) {
      const filtered = allSubCategories.filter(
        (sub) => sub.category?.id === category_id
      );
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
    setSubCategoryId("");
  }, [category_id, allSubCategories]);

  const handleSubmit = async () => {
    if (
      !category_id || !sub_category_id || !name || !slug || !description ||
      !price || discount === "" || !unit_value || !measurement_id ||
      !country_id || stock_quantity === ""
    ) {
      console.error("All fields are required");
      return;
    }

    const payload: ProductPayload = {
      category_id,
      sub_category_id,
      name,
      slug,
      description,
      price: Number(price),
      discount_percentage: Number(discount),
      unit_value: Number(unit_value),
      measurement_id,
      country_id,
      stock_quantity: Number(stock_quantity),
      is_active,
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
    category_id && sub_category_id && name && slug && description &&
    Number(price) > 0 && Number(discount) >= 0 && Number(unit_value) > 0 && 
    measurement_id && country_id && Number(stock_quantity) >= 0;

  return (
    <Box component="form" noValidate autoComplete="off" sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          label="Category"
          select
          value={category_id}
          onChange={(e) => setCategoryId(e.target.value)}
          fullWidth
          required
          disabled={fetching}
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Sub Category"
          select
          value={sub_category_id}
          onChange={(e) => setSubCategoryId(e.target.value)}
          fullWidth
          required
          disabled={fetching || !category_id}
          helperText={!category_id ? "Please select a category first" : ""}
        >
          {filteredSubCategories.map((sub) => (
            <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
          ))}
        </TextField>
      </Box>

      <TextField
        label="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
        sx={{ mb: 2.5 }}
      />

      <TextField
        label="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        fullWidth
        required
        helperText="URL-friendly version of the name (e.g., sweet-mangoes)"
        sx={{ mb: 2.5 }}
      />

      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        required
        multiline
        rows={4}
        sx={{ mb: 2.5 }}
      />

      <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          label="Price (USD)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          fullWidth
          required
          type="number"
        />
        <TextField
          label="Discount (%)"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          fullWidth
          required
          type="number"
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          label="Unit Value"
          value={unit_value}
          onChange={(e) => setUnitValue(e.target.value)}
          fullWidth
          required
          type="number"
        />
        <TextField
          label="Unit Type"
          select
          value={measurement_id}
          onChange={(e) => setMeasurementId(e.target.value)}
          fullWidth
          required
          disabled={fetching}
        >
          {measurements.map((m) => (
            <MenuItem key={m.id} value={m.id}>{m.label}</MenuItem>
          ))}
        </TextField>
      </Box>

      <Box sx={{ display: 'flex', gap: 2.5, mb: 2.5, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          label="Country"
          select
          value={country_id}
          onChange={(e) => setCountryId(e.target.value)}
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
          value={stock_quantity}
          onChange={(e) => setStockQuantity(e.target.value)}
          fullWidth
          required
          type="number"
        />
      </Box>

      <TextField
        label="Status"
        select
        value={String(is_active)}
        onChange={(e) => setIsActive(e.target.value === "true")}
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