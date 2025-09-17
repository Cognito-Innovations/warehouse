import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import BoxCard from "./BoxCard";
import BoxShipmentsList from "./BoxShipmentsList";
import Modal from "../common/Modal";
import BoxDetailsForm from "./BoxDetailsForm";
import { createShipmentExportBox, deleteShipmentExportBox, removePackageFromBox, updateShipmentExportBox } from "../../services/api.services";

interface BoxesSectionProps {
  boxes: any[];
  selectedBoxId: number | null;
  setSelectedBoxId: React.Dispatch<React.SetStateAction<number | null>>;
  shipmentId: string;
  packagesInSelectedBox: any[];
  loadingPackages: boolean;
  refreshPackages: () => void;
}

const BoxesSection: React.FC<BoxesSectionProps> = ({
  boxes,
  selectedBoxId,
  setSelectedBoxId,
  shipmentId,
  packagesInSelectedBox,
  loadingPackages,
  refreshPackages,
}) => {
  const [open, setOpen] = useState(false);
  const [localBoxes, setLocalBoxes] = useState<any[]>([]);

  useEffect(() => {
    setLocalBoxes(boxes || []);
  }, [boxes]);

  const handleEditClick = (boxId: number) => {
    setSelectedBoxId(boxId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBoxId(null);
  };

  const handleSave = async (values: any) => {
    if (selectedBoxId) {
      try {
        const updatedBox = await updateShipmentExportBox(selectedBoxId, {
          label: values.label, 
          length: values.length,
          breadth: values.breadth,
          height: values.height,
          grossWeight: values.volumetricWeight,
          massWeight: values.massWeight,
        });

        setLocalBoxes((prev) =>
          prev.map((b) => (b.id === selectedBoxId ? updatedBox : b))
        );
        } catch (error) {
        console.error("Failed to update box:", error);
      }
    }
    setOpen(false);
    setSelectedBoxId(null);
  };

  const handleAddBox = async () => {
    try {
      const newBox = await createShipmentExportBox(shipmentId, {
        length: 0,
        breadth: 0,
        height: 0,
        grossWeight: 0,
        massWeight: 0,
      });
      setLocalBoxes((prev) => [...prev, newBox]);
    } catch (error) {
      console.error("Failed to create box:", error);
    }
  };

  const handleDelete = async (boxId: number) => {
    try {
      await deleteShipmentExportBox(boxId);
      setLocalBoxes((prev) => prev.filter((b) => b.id !== boxId));
      if (selectedBoxId === boxId) {
        setSelectedBoxId(null);
      }
    } catch (error) {
      console.error("Failed to delete box:", error);
    }
  };

  const handleDeletePackage = async (packageId: string) => {
    if (!selectedBoxId) return;
    try {
        await removePackageFromBox(selectedBoxId, packageId);
        refreshPackages();
    } catch (error) {
        console.error("Failed to delete package from box:", error);
    }
  };

   return (
    <>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
        <Box sx={{ width: 250, flexShrink: 0 }}>
          {localBoxes.map((box, index) => (
            <BoxCard
              key={box.id}
              box={box}
              index={index}
              total={localBoxes.length}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onSelect={() => setSelectedBoxId(box.id)}
              selected={selectedBoxId === box.id}
            />
          ))}

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "none",
              alignSelf: "flex-start",
              mt: localBoxes.length > 0 ? 2 : 0, 
            }}
            onClick={handleAddBox}
          >
            Add New Box
          </Button>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {selectedBoxId ? (
            <BoxShipmentsList
              boxIndex={localBoxes.findIndex(b => b.id === selectedBoxId)}
              boxLabel={localBoxes.find(b => b.id === selectedBoxId)?.label}
              totalBoxes={localBoxes.length}
              shipments={packagesInSelectedBox}
              isLoading={loadingPackages}
              onDelete={handleDeletePackage}
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
                border: "1px dashed #e5e7eb",
                borderRadius: 2,
                color: "text.secondary",
              }}
            >
              <Typography>Please select a box</Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Modal open={open} onClose={handleClose} title="Update Box Details" size="sm">
        <BoxDetailsForm onSave={handleSave} />
      </Modal>
    </>
  );
};

export default BoxesSection;