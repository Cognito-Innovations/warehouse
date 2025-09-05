import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import BoxCard from "./BoxCard";
import BoxShipmentsList from "./BoxShipmentsList";
import Modal from "../common/Modal";
import BoxDetailsForm from "./BoxDetailsForm";
import { createShipmentExportBox, deleteShipmentExportBox, updateShipmentExportBox } from "../../services/api.services";

interface BoxesSectionProps {
  boxes: any[];
  selectedBoxId: number | null;
  setSelectedBoxId: React.Dispatch<React.SetStateAction<number | null>>;
  shipmentId: string;
}

const BoxesSection: React.FC<BoxesSectionProps> = ({ boxes, selectedBoxId, setSelectedBoxId, shipmentId }) => {
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

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
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
            }}
            onClick={handleAddBox}
          >
            Add New Box
          </Button>
        </Grid>

        <Grid item xs={12} md={5}>
          {selectedBoxId ? (
            <BoxShipmentsList
              boxId={selectedBoxId}
              shipments={[]}
              onDelete={(shipmentId) =>
                console.log("Delete shipment:", shipmentId)
              }
            />
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                color: "text.secondary",
                p: 3,
              }}
            >
              <Typography>Please select a box</Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      <Modal open={open} onClose={handleClose} title="Update Box Details" size="sm">
        <BoxDetailsForm onSave={handleSave} />
      </Modal>
    </>
  );
};

export default BoxesSection;