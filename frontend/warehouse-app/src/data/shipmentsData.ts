export type Shipment = {
  id: string;
  name: string;
  status: string;
};

export const shipmentsData: Shipment[] = [
  { id: "SHP001", name: "Order A", status: "shipment_request" },
  { id: "SHP002", name: "Order B", status: "payment_pending" },
  { id: "SHP003", name: "Order C", status: "payment_approved" },
  { id: "SHP004", name: "Order D", status: "ready_to_ship" },
  { id: "SHP005", name: "Order E", status: "shipped" },
  { id: "SHP006", name: "Order F", status: "discarded" },
];
