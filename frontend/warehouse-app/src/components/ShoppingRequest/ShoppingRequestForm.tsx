"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus as PlusIcon, Trash2 as TrashIcon } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { createShoppingRequest, createShoppingRequestProduct } from "@/lib/api.service";
import { useAddressAPI } from "@/hooks/useAddressAPI";

interface ShoppingItem {
  id: string;
  url: string;
  name: string;
  quantity: string;
  size: string;
  color: string;
  otherVariants: string;
  ifNotAvailableQuantity: string;
  ifNotAvailableColor: string;
}

export default function ShoppingRequestForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const { selectedAddress } = useAddressAPI();

  const [items, setItems] = useState<ShoppingItem[]>([
    {
      id: "1",
      url: "",
      name: "",
      quantity: "",
      size: "",
      color: "",
      otherVariants: "",
      ifNotAvailableQuantity: "",
      ifNotAvailableColor: "",
    },
  ]);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddNewItem = () => {
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      url: "",
      name: "",
      quantity: "",
      size: "",
      color: "",
      otherVariants: "",
      ifNotAvailableQuantity: "",
      ifNotAvailableColor: "",
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (
    id: string,
    field: keyof ShoppingItem,
    value: string
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userId = (session?.user as any)?.user_id;

    const shoppingRequest = {
      user_id: userId,
      request_code: `SR/${selectedAddress.country_code.toUpperCase()}/${Date.now()}`,
      courier_id: selectedAddress.id,
      items_count: items.length,
      remarks,
      status: "REQUESTED",
    };

    try {
      const requestRes = await createShoppingRequest(shoppingRequest);
      const requestId = requestRes.id;

      await Promise.all(
        items.map((item) =>
          createShoppingRequestProduct({
            shopping_request_id: requestId,
            name: item.name,
            url: item.url,
            quantity: Number(item.quantity),
            size: item.size,
            color: item.color,
            variants: item.otherVariants,
            if_not_available_quantity: item.ifNotAvailableQuantity,
            if_not_available_color: item.ifNotAvailableColor,
          })
        )
      );

      router.push("/assisted-shopping");
    } catch (error) {
      console.error("Error creating shopping request:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full px-3 py-1.5 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{index + 1}.</h3>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 tracking-tight">
                        Link <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={item.url}
                        placeholder="Link"
                        onChange={(e) =>
                          handleItemChange(item.id, "url", e.target.value)
                        }
                        className={inputStyles}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 tracking-tight">
                        Item Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        placeholder="Name / Description of item*"
                        onChange={(e) =>
                          handleItemChange(item.id, "name", e.target.value)
                        }
                        className={inputStyles}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 tracking-tight">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        placeholder="Quantity*"
                        onChange={(e) =>
                          handleItemChange(item.id, "quantity", e.target.value)
                        }
                        className={`${inputStyles} hide-number-arrows`}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 tracking-tight">
                        Size
                      </label>
                      <input
                        type="text"
                        value={item.size}
                        placeholder="Size"
                        onChange={(e) =>
                          handleItemChange(item.id, "size", e.target.value)
                        }
                        className={inputStyles}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 tracking-tight">
                        Color
                      </label>
                      <input
                        type="text"
                        placeholder="Color"
                        value={item.color}
                        onChange={(e) =>
                          handleItemChange(item.id, "color", e.target.value)
                        }
                        className={inputStyles}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 tracking-tight">
                    Other Variants
                  </label>
                  <input
                    type="text"
                    value={item.otherVariants}
                    onChange={(e) =>
                      handleItemChange(item.id, "otherVariants", e.target.value)
                    }
                    placeholder="Eg: Storage: 128GB, Metal: Silver"
                    className={inputStyles}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1 tracking-tight">
                    If not available <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={item.ifNotAvailableColor}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        "ifNotAvailableColor",
                        e.target.value
                      )
                    }
                    required
                    className={inputStyles}
                  >
                    <option value="">If Not Available</option>
                    <option value="Cancel this item, purchase all other item">
                      Cancel this item, purchase all other item
                    </option>
                    <option value="Cancel all items">Cancel all items</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddNewItem}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Add New Link
          </button>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-tight">
            Remarks
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter any specific requests"
            rows={4}
            className={`${inputStyles} resize-vertical`}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`bg-purple-700 text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors duration-200 
              ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-600"}`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <CircularProgress size={18} color="inherit" />
                Submitting...
              </div>
            ) : (
              "Submit Shopping Request"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
