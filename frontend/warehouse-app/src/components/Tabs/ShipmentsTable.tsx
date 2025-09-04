import React from "react";

interface Shipment {
  id: string;
  name: string;
  status: string;
}

interface ShipmentsTableProps {
  shipments: Shipment[];
}

const ShipmentsTable: React.FC<ShipmentsTableProps> = ({ shipments }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">ID</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {shipments.map((shipment) => (
            <tr key={shipment.id}>
              <td className="px-4 py-3 text-sm text-gray-700">{shipment.id}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{shipment.name}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{shipment.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShipmentsTable;
