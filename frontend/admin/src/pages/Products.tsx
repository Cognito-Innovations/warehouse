import type React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { Box, Typography } from "@mui/material";

import { deleteProduct, getProducts, updateEcommerceProduct } from "../services/api.services";
import TopNavbar from "../components/Layout/TopNavbar";
import CommonTable from "../components/common/CommonTable";
import AddActionButton from "../components/common/AddActionButton";
import ProductForm from "../components/Product/ProductForm";
import Modal from "../components/common/Modal"; 
import ConfirmDialog from "../components/common/ConfirmDialog";
import { FALLBACK_IMAGE, PRODUCT_STATUS_OPTIONS } from "../utils/constants";
import type { ColumnDefinition } from "../types/table";
import type { ProductPayload, ProductRow } from "../types";

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductPayload | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');

  const lastRequestId = useRef(0);

  const fetchProducts = useCallback(async (searchTerm: string = '') => {
    const currentRequestId = ++lastRequestId.current;
    
    try {
      setLoading(true);
      const response = await getProducts(searchTerm);

      if (currentRequestId !== lastRequestId.current) {
        return; 
      }
      
      setProducts(response.map(mapProductToRow));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      if (currentRequestId === lastRequestId.current) {
        setLoading(false);
      }
    }
  }, []);

  const mapProductToRow = (item: any): ProductRow => {
    const priceValue = item.price?.price || item.price || 0;
    const currencyValue = item.price?.currency;

    return {
      id: item.id,
      name: item.name,
      slug: item.slug || "",
      description: item.description || "",
      image_url: item.image_url || "",
      category: item.category?.name || "N/A",
      category_id: item.category?.id || "",
      sub_category: item.sub_category?.name || "N/A",
      sub_category_id: item.sub_category?.id || "",
      price: {
        price: parseFloat(priceValue) || 0,
        currency: currencyValue
      },
      discount_percentage: parseFloat(item.discount_percentage) || 0,
      unit: `${parseFloat(item.unit_value).toFixed(0)} ${item.measurement?.label || ''}`.trim(),
      unit_value: parseFloat(item.unit_value) || 0,
      measurement_id: item.measurement?.id || "",
      stock_quantity: item.stock_quantity || 0,
      // countries: item.countries || [],
      cargo_option_id: item.cargo_option?.id,
      cargo_type_label: item.cargo_option?.label,
      status: item.is_active ? "Active" : "Inactive",
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    fetchProducts(debouncedSearchValue);
  }, [debouncedSearchValue, fetchProducts]);

  const handleToggleStatus = async (id: string | number, newActive: boolean) => {
    const idStr = String(id);
    setTogglingIds((prev) => new Set([...prev, idStr]));
    try {
      await updateEcommerceProduct(idStr, { is_active: newActive } as Partial<ProductPayload>);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === idStr
            ? { ...p, status: newActive ? 'Active' : 'Inactive' }
            : p
        )
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setTogglingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(idStr);
        return newSet;
      });
    }
  };

  const handleEditProduct = (id: string | number) => {
    const product = products.find((product) => product.id === String(id));
    if (!product) return;
  
    const payload: ProductPayload = {
      id: product.id,
      category_id: product.category_id,
      sub_category_id: product.sub_category_id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      image_url: product.image_url,
      price: product.price.price,
      discount_percentage: product.discount_percentage,
      unit_value: product.unit_value,
      measurement_id: product.measurement_id,
      // country_ids: product.countries.map((country: Country) => country.id),
      cargo_option_id: product.cargo_option_id,
      stock_quantity: product.stock_quantity,
      is_active: product.status === "Active",
    };
    
    setEditingProduct(payload);
    setModalOpen(true);
  };

  const handleDeleteClick = (id: string | number) => {
    setDeletingProductId(String(id));
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProductId) return;
    try {
      setDeleteLoading(true);
      await deleteProduct(deletingProductId);
      setProducts((prev) => prev.filter((product) => product.id !== deletingProductId));
      setDeleteDialogOpen(false);
      setDeletingProductId(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const noDataMessage = searchValue.trim() ? "Product not found" : "No products available";

  const columns: ColumnDefinition<ProductRow>[] = [
    {
      header: "Image URL",
      cell: (row) =><img
        src={row.image_url || FALLBACK_IMAGE}
        alt={row.name}
        width={100}
        height={100}
        style={{ objectFit: "cover" }}
        onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
    />,
      width: "25%",
    },
    {
      header: "Product Name",
      cell: (row) => <Typography variant="body2">{row.name}</Typography>,
      width: "25%",
    },
    {
      header: "Category",
      cell: (row) => <Typography variant="body2">{row.category}</Typography>,
      width: "25%",
    },
    {
      header: "Sub Category",
      cell: (row) => <Typography variant="body2">{row.sub_category}</Typography>,
      width: "25%",
    },
    {
      header: "Cargo Type",
      cell: (row) => <Typography variant="body2">{row.cargo_type_label}</Typography>,
      width: "15%",
    },
    {
      header: "Unit",
      cell: (row) => <Typography variant="body2">{row.unit}</Typography>,
      width: "15%",
    },
    {
      header: "Price",
      cell: (row) => <Typography variant="body2"> {row.price.currency} {row.price.price.toFixed(2)}</Typography>,
      width: "20%",
    },
    {
      header: "Discount",
      cell: (row) => <Typography variant="body2">{row.discount_percentage !== undefined ? `${row.discount_percentage}%` : "0%"}</Typography>,
      width: "20%",
    },
    {
      header: "Stock",
      cell: (row) => <Typography variant="body2">{row.stock_quantity}</Typography>,
      width: "20%",
    },
  ];

  const isToggleLoading = (id: string | number) => togglingIds.has(String(id));

  return (
    <Box>
      <TopNavbar
        pageTitle="Products"
        pageSubtitle="All"
        searchValue={searchValue} 
        onSearchChange={handleSearchChange}
        placeholder="Search product by product name"
        showSearchBar
      />

      <AddActionButton
        label="Add New Product"
        onClick={() => setModalOpen(true)}
        loading={false}
        disabled={false}
      />

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(undefined);
        }}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        size="md"
      >
        <ProductForm
          onClose={() => {
            setModalOpen(false);
            setEditingProduct(undefined);
          }}
          onSuccess={() => fetchProducts(searchValue)}
          initialData={editingProduct}
        />
      </Modal>

      <CommonTable
        rows={products}
        columns={columns}
        loading={loading}
        statusOptions={PRODUCT_STATUS_OPTIONS}
        noDataMessage={noDataMessage}
        getIdentifier={(row) => row.id}
        getRowStatus={(row) => row.status}
        onEdit={handleEditProduct}
        onDelete={handleDeleteClick}
        onToggle={handleToggleStatus}
        isToggleLoading={isToggleLoading}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingProductId(null);
        }}
        isLoading={deleteLoading}
      />
    </Box>
  );
};

export default Products;