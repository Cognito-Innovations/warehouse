import type React from "react";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import { deleteCategory, getCategories } from "../services/api.services";
import TopNavbar from "../components/Layout/TopNavbar";
import CommonTable from "../components/common/CommonTable";
import StatusChip from "../components/common/StatusChip";
import AddActionButton from "../components/common/AddActionButton";
import Modal from "../components/common/Modal";
import CategoryForm from "../components/Category/CategoryForm";
import ConfirmDialog from "../components/common/ConfirmDialog";
import type { ColumnDefinition } from "../types/table";
import type { CategoryPayload } from "../types";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  discount_percentage: number,
  country_id: string,
  products: number;
  status: string;
}

const Category: React.FC = () => {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [editingCategory, setEditingCategory] = useState<CategoryPayload | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      const mappedData: CategoryRow[] = response.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        discount_percentage: parseFloat(item.discount_percentage),
        country_id: item.country.id,
        products: item.products_count ?? 0,
        status: item.is_active ? "Active" : "Inactive",
      }));
      setCategories(mappedData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditCategory = (id: string | number) => {
    const category = categories.find((category) => category.id === id);
    if (!category) return;
  
    const payload: CategoryPayload = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      discount_percentage: category.discount_percentage,
      country_id: category.country_id,
      is_active: category.status === "Active",
    };
    
    setEditingCategory(payload);
    setModalOpen(true);
  };

    const handleDeleteClick = (id: string | number) => {
      setDeletingCategoryId(String(id));
      setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
      if (!deletingCategoryId) return;
      try {
        setDeleteLoading(true);
        await deleteCategory(deletingCategoryId);
        setCategories((prev) => prev.filter((category) => category.id !== deletingCategoryId));
        setDeleteDialogOpen(false);
        setDeletingCategoryId(null);
      } catch (error) {
        console.error("Error deleting category:", error);
      } finally {
        setDeleteLoading(false);
      }
    };

  const columns: ColumnDefinition<CategoryRow>[] = [
    {
      header: "Category ID",
      cell: (row) => <Typography variant="body2" fontWeight={500}>{row.id}</Typography>,
      width: "25%",
    },
    {
      header: "Category Name",
      cell: (row) => <Typography variant="body2">{row.name}</Typography>,
      width: "25%",
    },
    {
      header: "Slug",
      cell: (row) => <Typography variant="body2">{row.slug}</Typography>,
      width: "15%",
    },
    {
      header: "Products",
      cell: (row) => <Typography variant="body2">{row.products}</Typography>,
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
      <TopNavbar pageTitle="Categories" />

       <AddActionButton
          label="Add Category"
          onClick={() => setModalOpen(true)}
          loading={false}
          disabled={false}
        />

        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingCategory(undefined);
          }}
          title={editingCategory ? "Edit" : "Add"}
        >
            <CategoryForm
              onClose={() => {
                setModalOpen(false);
                setEditingCategory(undefined);
              }}
              onSuccess={fetchCategories}
              initialData={editingCategory}
            />
        </Modal>

      <CommonTable
        rows={categories}
        columns={columns}
        loading={loading}
        noDataMessage="No categories available"
        getIdentifier={(row) => row.id}
        getRowStatus={(row) => row.status}
        onEdit={handleEditCategory}
        onDelete={handleDeleteClick}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Category"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeletingCategoryId(null);
        }}
        isLoading={deleteLoading}
      />
    </Box>
  );
};

export default Category;
