export const addBoxToShipment = (shipment: any, newBox: any) => {
  if (!shipment) return shipment;

  return {
    ...shipment,
    boxes: [...(shipment.boxes || []), newBox],
  };
};

export const updateBoxInShipment = (shipment: any, updatedBox: any) => {
  if (!shipment) return shipment;

  return {
    ...shipment,
    boxes: shipment.boxes.map((box: any) =>
      box.id === updatedBox.id ? updatedBox : box
    ),
  };
};

export const removeBoxFromShipment = (shipment: any, boxId: string) => {
  if (!shipment) return shipment;

  return {
    ...shipment,
    boxes: shipment.boxes.filter((box: any) => box.id !== boxId),
  };
};

export const addShipmentToBox = (
  shipment: any,
  boxId: string | null,
  newShipment: any
) => {
  if (!shipment || !boxId) return shipment;

  return {
    ...shipment,
    boxes: shipment.boxes.map((box: any) =>
      box.id === boxId
        ? {
            ...box,
            shipments: [...(box.shipments || []), newShipment],
          }
        : box
    ),
  };
};

export const removeShipmentFromBox = (
  shipment: any,
  boxId: string | null,
  shipmentId: string
) => {
  if (!shipment || !boxId) return shipment;

  return {
    ...shipment,
    boxes: shipment.boxes.map((box: any) =>
      box.id === boxId
        ? {
            ...box,
            shipments: (box.shipments || []).filter(
              (shipment: any) => shipment.id !== shipmentId
            ),
          }
        : box
    ),
  };
};

export const updateExportStatusWithDepartedShipments = (
  shipment: any,
  newStatus: string
) => {
  if (!shipment) return shipment;

  return {
    ...shipment,
    status: newStatus,
    boxes: shipment.boxes?.map((box: any) => ({
      ...box,
      shipments: box.shipments?.map((shipment: any) => ({
        ...shipment,
        status: "DEPARTED",
      })),
    })),
  };
};
