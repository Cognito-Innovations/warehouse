import React, { useEffect, useState } from 'react';

type QuotationItem = {
  id: string;
  name: string;
  url: string;
  color?: string | null;
  size?: string | null;
  quantity: number;
  unit_price?: number | null;
};

export default function QuotationItems({
  items,
  onSelectionChange,
}: {
  items: QuotationItem[];
  onSelectionChange: (selected: QuotationItem[]) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedIds(items.map(i => i.id));
    onSelectionChange(items);
  }, [items]);

  const toggle = (id: string) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter(x => x !== id)
      : [...selectedIds, id];
    setSelectedIds(next);
    onSelectionChange(items.filter(i => next.includes(i.id)));
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800">Items / Links</h3>
      <div className="bg-white p-4 rounded-lg border border-gray-200 mt-1">
        {items.map((item, idx) => {
          const qty = Number(item.quantity || 0);
          const price = Number(item.unit_price || 0);
          const itemTotal = qty * price;

          return (
            <div
              key={item.id || idx}
              className="border-t border-gray-200 py-4 first:border-t-0 first:pt-0 last:pb-0"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggle(item.id)}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-purple-600 hover:underline font-medium"
                    >
                      View Item
                    </a>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-sm text-gray-500">
                    Color: <span className="font-medium text-gray-800">{item.color || '-'}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Size: <span className="font-medium text-gray-800">{item.size || '-'}</span>
                  </p>

                  <p className="text-sm text-gray-900 font-semibold mt-2">Item Total</p>
                  <p className="text-xs text-gray-500">
                    ({qty} × {price.toFixed(2)})
                  </p>
                  <p className="text-sm font-bold text-gray-800">${itemTotal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}