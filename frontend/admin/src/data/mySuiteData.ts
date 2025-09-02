export interface Rack {
  id: number;
  label: string;
  color: string;
  count: number;
}

export const initialRacks: Rack[] = [
  { id: 1, label: 'BIN IN', color: '#4ade80', count: 723 },
  { id: 2, label: 'HOLD ZONE', color: '#f87171', count: 42 },
  { id: 3, label: 'BIN OUT', color: '#000000', count: 142 },
  { id: 4, label: 'PACKAGE ARRIVED', color: '#2dd4bf', count: 274 },
  { id: 5, label: 'SHIPMENT ONHOLD', color: '#60a5fa', count: 43 },
  { id: 6, label: 'DEPART', color: '#c084fc', count: 5 },
];