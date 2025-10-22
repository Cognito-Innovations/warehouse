import type React from "react";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import { getProducts } from "../services/api.services";
import TopNavbar from "../components/Layout/TopNavbar";
import CommonTable from "../components/common/CommonTable";
import StatusChip from "../components/common/StatusChip";
import type { ColumnDefinition } from "../types/table";
import AddActionButton from "../components/common/AddActionButton";
import ProductForm from "../components/Product/ProductForm";
import Modal from "../components/common/Modal"; 

interface ProductRow {
  id: string;
  name: string;
  category: string;
  sub_category: string;
  price: number;
  discount_percentage: string;
  unit: string;
  stock: number;
  status: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      const mappedData: ProductRow[] = response.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category?.name || "N/A",
        sub_category: item.sub_category?.name || "N/A",
        price: item.price,
        discount_percentage: parseFloat(item.discount_percentage).toFixed(0),
        unit: `${parseFloat(item.unit_value).toFixed(0)} ${item.measurement?.label || ''}`.trim(),
        stock: item.stock_quantity,
        status: item.is_active ? "Active" : "Inactive",
      }));
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

  const columns: ColumnDefinition<ProductRow>[] = [
    {
      header: "Product ID",
      cell: (row) => <Typography variant="body2" fontWeight={500}>{row.id}</Typography>,
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
      width: "15%",
    },
    {
      header: "Sub Category",
      cell: (row) => <Typography variant="body2">{row.sub_category}</Typography>,
      width: "15%",
    },
    {
      header: "Unit",
      cell: (row) => <Typography variant="body2">{row.unit}</Typography>,
      width: "15%",
    },
    {
      header: "Price",
      cell: (row) => <Typography variant="body2">${row.price}</Typography>,
      width: "20%",
    },
    {
      header: "Discount",
      cell: (row) => <Typography variant="body2">{row.discount_percentage ? `${row.discount_percentage}%` : "0%"}</Typography>,
      width: "20%",
    },
    {
      header: "Stock",
      cell: (row) => <Typography variant="body2">{row.stock}</Typography>,
      width: "20%",
    },
    {
      header: "Status",
      cell: (row) => <StatusChip status={row.status} />,
      width: "15%",
    },
  ];

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
        onClose={() => setModalOpen(false)}
        title="Add New Product"
        size="md"
      >
        <ProductForm
          onClose={() => setModalOpen(false)}
          onSuccess={fetchProducts}
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
      />
    </Box>
  );
};

export default Products;