import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { getShipmentsByShipmentNo } from "../services/api.services";

interface ShipmentDetailContextType {
  shipment: any | null;
  loading: boolean;
  isDiscarded: boolean;
  fetchShipments: () => Promise<void>;
}

const ShipmentDetailContext = createContext< ShipmentDetailContextType | undefined >(undefined);

export const ShipmentDetailProvider = ({ children }: { children: ReactNode }) => {
  const { shipment_no } = useParams();

  const [shipment, setShipment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchShipments = useCallback(async () => {
    if (!shipment_no) return;
    setLoading(true);
    try {
      const data = await getShipmentsByShipmentNo(shipment_no);
      setShipment(data);
    } catch (err) {
      console.error("Error fetching shopping request:", err);
    } finally {
      setLoading(false);
    }
  }, [shipment_no]);
  
  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  const isDiscarded = shipment?.status === 'DISCARDED';

  return (
    <ShipmentDetailContext.Provider
      value={{
        shipment,
        loading,
        isDiscarded,
        fetchShipments,
      }}
    >
      {children}
    </ShipmentDetailContext.Provider>
  );
};

export const useShipmentDetail = () => {
  const context = useContext(ShipmentDetailContext);
  if (!context) {
    throw new Error('useShipmentDetail must be used within ShipmentDetailProvider')
  }
  return context;
};