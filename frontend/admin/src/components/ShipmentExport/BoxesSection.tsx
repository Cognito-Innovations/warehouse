import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import {
  createShipmentExportBox,
  deleteShipmentExportBox,
  updateShipmentExportBox,
} from "../../services/api.services";
import BoxCard from "./BoxCard";
import BoxShipmentsList, { type Shipment } from "./BoxShipmentsList";
import Modal from "../common/Modal";
import BoxDetailsForm from "./BoxDetailsForm";

interface BoxItem {
  id: number;
  label: string;
  length_cm: number;
  breadth_cm: number;
  height_cm: number;
  volumetric_weight?: number;
  mass_weight?: number;
}

interface BoxFormValues {
  label: string;
  length: string;
  breadth: string;
  height: string;
  volumetricWeight: string;
  massWeight: string;
}

interface BoxesSectionProps {
  boxes: BoxItem[];
  selectedBoxId: number | null;
  setSelectedBoxId: React.Dispatch<React.SetStateAction<number | null>>;
  shipmentId: string;
  shipmentsInSelectedBox: Shipment[];
  loadingShipments: boolean;
  refreshShipments: () => void;
  onBoxAdded: () => void;
  status: string;
}

const BoxesSection: React.FC<BoxesSectionProps> = ({
  boxes,
  selectedBoxId,
  setSelectedBoxId,
  shipmentId,
  shipmentsInSelectedBox,
  loadingShipments,
  refreshShipments,
  onBoxAdded,
  status,
}) => {
  const [open, setOpen] = useState(false);
  const [isAddingBox, setIsAddingBox] = useState(false);
  const [deletingBoxId, setDeletingBoxId] = useState<number | null>(null);
  const [editingBoxLabel, setEditingBoxLabel] = useState<string | null>(null);

  const isDeparted = status === "SHIPMENTS DEPARTED";
  const selectedBoxData = boxes.find((b) => b.id === selectedBoxId);

  const handleEditClick = (boxId: number, displayLabel: string) => {
    if (isDeparted) return;
    setSelectedBoxId(boxId);
    setEditingBoxLabel(displayLabel);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBoxId(null);
    setEditingBoxLabel(null);
  };

  const handleSave = async (values: BoxFormValues) => {
    if (!selectedBoxId || isDeparted) return;

    try {
      await updateShipmentExportBox(selectedBoxId, {
        label: values.label,
        length_cm: Number(values.length),
        breadth_cm: Number(values.breadth),
        height_cm: Number(values.height),
        volumetric_weight: Number(values.volumetricWeight),
        mass_weight: Number(values.massWeight),
      });
      
      onBoxAdded();
      setOpen(false);
      setSelectedBoxId(null);
      setEditingBoxLabel(null);
    } catch (error) {
      console.error("Failed to update box:", error);
    }
  };

  const handleAddBox = async () => {
    if (isDeparted) return; // Disabled when departed
    setIsAddingBox(true);
    try {
      await createShipmentExportBox(shipmentId, {
        length_cm: 0,
        breadth_cm: 0,
        height_cm: 0,
        volumetric_weight: 0,
        mass_weight: 0,
      });
      onBoxAdded();
    } catch (error) {
      console.error("Failed to create box:", error);
    } finally {
      setIsAddingBox(false);
    }
  };

  const handleDelete = async (boxId: number) => {
    if (isDeparted) return; // Disabled when departed
    setDeletingBoxId(boxId);
    try {
      await deleteShipmentExportBox(boxId);
      onBoxAdded();
      if (selectedBoxId === boxId) {
        setSelectedBoxId(null);
      }
    } catch (error) {
      console.error("Failed to delete box:", error);
    } finally {
      setDeletingBoxId(null);
    }
  };

   return (
    <>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
        <Box sx={{ width: 250, flexShrink: 0 }}>
          {boxes.map((box, index) => (
            <BoxCard
              key={box.id}
              box={box}
              index={index}
              total={boxes.length}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onSelect={() => setSelectedBoxId(box.id)}
              selected={selectedBoxId === box.id}
              isDeleting={deletingBoxId === box.id}
              isDeparted={isDeparted}
            />
          ))}

          <Button
            variant="contained"
            disabled={isAddingBox || isDeparted}
            startIcon={
              isAddingBox ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <AddIcon />
              )
            }
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "none",
              alignSelf: "flex-start",
              mt: boxes.length > 0 ? 2 : 0, 
            }}
            onClick={handleAddBox}
          >
            {isAddingBox ? "Adding..." : "Add New Box"}
          </Button>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {selectedBoxId ? (
            <BoxShipmentsList
              boxId={selectedBoxId}
              refreshShipments={refreshShipments}
              boxIndex={boxes.findIndex(b => b.id === selectedBoxId)}
              boxLabel={boxes.find(b => b.id === selectedBoxId)?.label}
              totalBoxes={boxes.length}
              shipments={shipmentsInSelectedBox}
              isLoading={loadingShipments}
              isDeparted={isDeparted}
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
        {selectedBoxData && (
          <BoxDetailsForm
            onSave={handleSave}
            initialValues={{
              label: editingBoxLabel ?? selectedBoxData.label,
              length: String(selectedBoxData.length_cm),
              breadth: String(selectedBoxData.breadth_cm),
              height: String(selectedBoxData.height_cm),
              volumetricWeight: String(selectedBoxData.volumetric_weight),
              massWeight: String(selectedBoxData.mass_weight),
            }}
          />
        )}
      </Modal>
    </>
  );
};

export default BoxesSection;