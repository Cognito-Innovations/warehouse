import type React from "react";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

import { deleteSubCategory, getSubCategories } from "../services/api.services";
import TopNavbar from "../components/Layout/TopNavbar";
import CommonTable from "../components/common/CommonTable";
import StatusChip from "../components/common/StatusChip";
import AddActionButton from "../components/common/AddActionButton";
import Modal from "../components/common/Modal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SubCategoryForm from "../components/SubCategory/SubCategoryForm";
import type { ColumnDefinition } from "../types/table";
import type { Country, SubCategoryPayload } from "../types";

interface SubCategoryRow {
  id: string;
  name: string;
  slug: string;
  discount_percentage: number,
  countries: Country[],
  categoryName: string;
  categoryId: string | null;
  products: number;
  status: string;
}

const SubCategory: React.FC = () => {
  const [subcategories, setSubCategories] = useState<SubCategoryRow[]>([]);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategoryPayload | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchSubCategories = async () => {
    try {
      setLoading(true);
      const response = await getSubCategories();
      const mappedData: SubCategoryRow[] = response.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        discount_percentage: item.discount_percentage,
        countries: item.countries || [],
        categoryName: item.category?.name || "N/A",
        categoryId: item.category?.id || null,
        products: item.products_count ?? 0,
        status: item.is_active ? "Active" : "Inactive",
      }));
      setSubCategories(mappedData);
    } catch (error) {
      console.error("Error fetching sub categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, []);

  const handleEditSubCategory = (id: string | number) => {
    const sub_category = subcategories.find((sub_category) => sub_category.id === id);
    if (!sub_category || !sub_category.categoryId) return;
  
    const payload: SubCategoryPayload = {
      id: sub_category.id,
      category_id: sub_category.categoryId,
      name: sub_category.name,
      slug: sub_category.slug,
      discount_percentage: sub_category.discount_percentage,
      country_ids: sub_category.countries.map((country: Country) => country.id),
      is_active: sub_category.status === "Active",
    };
    setEditingSubCategory(payload);
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
      await deleteSubCategory(deletingCategoryId);
      setSubCategories((prev) => prev.filter((sub_category) => sub_category.id !== deletingCategoryId));
      setDeleteDialogOpen(false);
      setDeletingCategoryId(null);
    } catch (error) {
      console.error("Error deleting sub category:", error);
    } finally {
      setDeleteLoading(false);
    }
  };
  
  const columns: ColumnDefinition<SubCategoryRow>[] = [
    {
      header: "Sub Category ID",
      cell: (row) => <Typography variant="body2" fontWeight={500}>{row.id}</Typography>,
      width: "25%",
    },
    {
      header: "Sub Category Name",
      cell: (row) => <Typography variant="body2">{row.name}</Typography>,
      width: "25%",
    },
    {
      header: "Slug",
      cell: (row) => <Typography variant="body2">{row.slug}</Typography>,
      width: "15%",
    },
    {
      header: "Parent Category",
      cell: (row) => <Typography variant="body2">{row.categoryName}</Typography>,
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
      <TopNavbar pageTitle="Sub Categories" />

       <AddActionButton
          label="Add Sub Category"
          onClick={() => setModalOpen(true)}
          loading={false}
          disabled={false}
        />

        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingSubCategory(undefined);
          }}
          title={editingSubCategory ? "Edit" : "Add"}
        >
            <SubCategoryForm
              onClose={() => {
                setModalOpen(false);
                setEditingSubCategory(undefined);
              }}
              onSuccess={fetchSubCategories}
              initialData={editingSubCategory}
            />
        </Modal>        

      <CommonTable
        rows={subcategories}
        columns={columns}
        loading={loading}
        noDataMessage="No sub categories available"
        getIdentifier={(row) => row.id}
        getRowStatus={(row) => row.status}
        onEdit={handleEditSubCategory}
        onDelete={handleDeleteClick}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Sub Category"
        message="Are you sure you want to delete this sub category? This action cannot be undone."
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

export default SubCategory;
