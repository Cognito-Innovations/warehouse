import React from 'react';

interface Item {
  id: string;
  name: string;
  url: string;
  color: string;
  size: string;
  ifNotAvailableColor?: string;
  ifNotAvailableQuantity?: string;
}

interface ItemsListProps {
  items: Item[];
}

const ItemsList: React.FC<ItemsListProps> = ({ items }) => {
  // Safety check to ensure items is an array
  const safeItems = items || [];
  
  return (
    <div>
    <h3 className="text-lg font-bold text-gray-800">Items / Links</h3>
    <div className="bg-white p-4 rounded-lg border border-gray-200 mt-1">
      {safeItems.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No items found for this request.</p>
      ) : (
        safeItems.map((item, index) => (
        <div key={index} className="border-t border-gray-200 py-4 first:border-t-0 first:pt-0 last:pb-0">
           <div className="flex justify-between items-start">
                <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600 hover:underline font-medium">
                        View Item
                    </a>
                    <p className="text-xs text-gray-500 mt-2">
                        <span className="font-medium">Action:</span> {item.ifNotAvailableColor || item.ifNotAvailableQuantity}
                    </p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-sm text-gray-500">
                        Color: <span className="font-medium text-gray-800">{item.color || "-"}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                        Size: <span className="font-medium text-gray-800">{item.size || "-"}</span>
                    </p>
                </div>
           </div>
        </div>
        ))
      )}
    </div>
    </div>
  );
};

export default ItemsList;