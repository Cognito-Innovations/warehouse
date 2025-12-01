import type React from "react";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import { deleteProduct, getProducts, updateEcommerceProduct } from "../services/api.services";
import type { Country, ProductPayload } from "../types";
import TopNavbar from "../components/Layout/TopNavbar";
import CommonTable from "../components/common/CommonTable";
import AddActionButton from "../components/common/AddActionButton";
import ProductForm from "../components/Product/ProductForm";
import Modal from "../components/common/Modal"; 
import ConfirmDialog from "../components/common/ConfirmDialog";
import type { ColumnDefinition } from "../types/table";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  category: string;
  category_id: string;
  sub_category: string;
  sub_category_id: string;
  price: number;
  discount_percentage: number;
  unit: string;
  unit_value: number;
  measurement_id: string;
  stock_quantity: number;
  countries: Country[];
  cargo_type_label: string;
  cargo_option_id: string;
  status: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [editingProduct, setEditingProduct] = useState<ProductPayload | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      const mappedData: ProductRow[] = response.map((item: any) => {
        const priceMatch = item.price.toString().match(/[\d.]+/);
        const priceStr = priceMatch ? priceMatch[0] : '0';
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
          price: parseFloat(priceStr) || 0,
          discount_percentage: parseFloat(item.discount_percentage) || 0,
          unit: `${parseFloat(item.unit_value).toFixed(0)} ${item.measurement?.label || ''}`.trim(),
          unit_value: parseFloat(item.unit_value) || 0,
          measurement_id: item.measurement?.id || "",
          stock_quantity: item.stock_quantity || 0,
          countries: item.countries || [],
          cargo_option_id: item.cargo_option?.id,
          cargo_type_label: item.cargo_option?.label,
          status: item.is_active ? "Active" : "Inactive",
        };
      });
      setProducts(mappedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

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
      price: product.price,
      discount_percentage: product.discount_percentage,
      unit_value: product.unit_value,
      measurement_id: product.measurement_id,
      country_ids: product.countries.map((country: Country) => country.id),
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

  const columns: ColumnDefinition<ProductRow>[] = [
    {
      header: "Image URL",
      cell: (row) =><img
        src={row.image_url || "https://placehold.co/100x100?text=No+Image"}
        alt={row.name}
        width={100}
        height={100}
        style={{ objectFit: "cover" }}
        onError={(e) => (e.currentTarget.src = "https://placehold.co/100x100?text=No+Image")}
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
      cell: (row) => <Typography variant="body2">${row.price.toFixed(2)}</Typography>,
      width: "20%",
    },
    {
      header: "Discount",
      cell: (row) => <Typography variant="body2">{row.discount_percentage ? `${row.discount_percentage.toFixed(0)}%` : "0%"}</Typography>,
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
      <TopNavbar pageTitle="Products" pageSubtitle="All" />

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
          onSuccess={fetchProducts}
          initialData={editingProduct}
        />
      </Modal>

      <CommonTable
        rows={products}
        columns={columns}
        loading={loading}
        statusOptions={statusOptions}
        noDataMessage="No products available"
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