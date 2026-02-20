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
import { FALLBACK_IMAGE } from "../utils/constants";
import type { ColumnDefinition } from "../types/table";
import type { CategoryPayload, CategoryRow,
  // Country
} from "../types";

const mapCategoryToRow = (item: any): CategoryRow => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  discount_percentage: item.discount_percentage,
  // countries: item.countries || [],
  products: item.products_count ?? 0,
  image_url: item.image_url || "",
  description: item.description || "",
  status: item.is_active ? "Active" : "Inactive",
});

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
      const mappedData: CategoryRow[] = response.map(mapCategoryToRow);
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
      // country_ids: category.countries.map((country: Country) => country.id),
      is_active: category.status === "Active",
      image_url: category.image_url || "",
      description: category.description || "",
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

  const handleCategorySuccess = (savedItem: any) => {
    const mappedItem = mapCategoryToRow(savedItem);

    setCategories((prev) => {
      const exists = prev.some((item) => item.id === mappedItem.id);

      if (exists) {
        return prev.map((item) =>
          item.id === mappedItem.id ? mappedItem : item
        );
      }

      return [...prev, mappedItem];
    });
  };

  const columns: ColumnDefinition<CategoryRow>[] = [
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
      width: "15%",
    },
    {
      header: "Category Name",
      cell: (row) => <Typography variant="body2">{row.name}</Typography>,
      width: "25%",
    },
    // TODO: Uncomment the country selection when it's required
    // {
    //   header: "Countries",
    //   cell: (row) => (
    //     <Typography variant="body2">
    //       {row.countries && row.countries.length > 0
    //         ? row.countries.map((country) => country.name).join(", ")
    //         : "N/A"}
    //     </Typography>
    //   ),
    //   width: "20%",
    // },
    {
      header: "Slug",
      cell: (row) => <Typography variant="body2">{row.slug}</Typography>,
      width: "15%",
    },
    {
      header: "Products",
      cell: (row) => <Typography variant="body2">{row.products}</Typography>,
      width: "15%",
    },
    {
      header: "Status",
      cell: (row) => <StatusChip status={row.status} />,
      width: "15%",
    },
  ];

  const actions = {
    onEdit: handleEditCategory,
    onDelete: handleDeleteClick,
  };

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
              onSuccess={handleCategorySuccess}
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
        actions={actions}
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
