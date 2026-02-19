import React, { useState } from "react";
import { Box, Typography } from "@mui/material";

import { deleteShipmentExportBox, updateShipmentExportBox } from "../../services/api.services";
import BoxCard from "./BoxCard";
import BoxShipmentsList from "./BoxShipmentsList";
import Modal from "../common/Modal";
import BoxDetailsForm from "./BoxDetailsForm";
import AddNewBoxButton from "./AddNewBoxButton";
import type { BoxFormValues, BoxItem, Shipment } from "../../types";

interface BoxesSectionProps {
  boxes: BoxItem[];
  selectedBoxId: string | null;
  setSelectedBoxId: React.Dispatch<React.SetStateAction<string | null>>;
  shipmentId: string;
  shipmentsInSelectedBox: Shipment[];
  loadingShipments: boolean;
  onShipmentRemoved: (shipmentId: string) => void;
  onBoxCreated: (box: any) => void;
  onBoxUpdated: (box: any) => void;
  onBoxDeleted: (boxId: string) => void;
  status: string;
}

const BoxesSection: React.FC<BoxesSectionProps> = ({
  boxes,
  selectedBoxId,
  setSelectedBoxId,
  shipmentId,
  shipmentsInSelectedBox,
  loadingShipments,
  onShipmentRemoved,
  onBoxCreated,
  onBoxUpdated,
  onBoxDeleted,
  status,
}) => {
  const [open, setOpen] = useState(false);
  const [deletingBoxId, setDeletingBoxId] = useState<string | null>(null);
  const [editingBoxLabel, setEditingBoxLabel] = useState<string | null>(null);

  const isDeparted = status === "SHIPMENTS DEPARTED";
  const selectedBoxData = boxes.find((box) => box.id === selectedBoxId);
  const selectedBoxIndex = boxes.findIndex((box) => box.id === selectedBoxId);

  const handleEditClick = (boxId: string, displayLabel: string) => {
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
      const updatedBox = await updateShipmentExportBox(selectedBoxId, {
        label: values.label,
        length_cm: Number(values.length),
        breadth_cm: Number(values.breadth),
        height_cm: Number(values.height),
        volumetric_weight: Number(values.volumetricWeight),
        mass_weight: Number(values.massWeight),
      });
      
      onBoxUpdated(updatedBox);
      handleClose();
    } catch (error) {
      console.error("Failed to update box:", error);
    }
  };

  const handleDelete = async (boxId: string) => {
    if (isDeparted) return;
    setDeletingBoxId(boxId);
    try {
      await deleteShipmentExportBox(boxId);
      onBoxDeleted(boxId);
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

          <AddNewBoxButton
            shipmentId={shipmentId}
            onBoxCreated={onBoxCreated}
            isDeparted={isDeparted}
            hasBoxes={boxes.length > 0}
          />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {selectedBoxId ? (
            <BoxShipmentsList
              boxId={selectedBoxId}
              onShipmentRemoved={onShipmentRemoved}
              boxIndex={selectedBoxIndex}
              boxLabel={selectedBoxData?.label}
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