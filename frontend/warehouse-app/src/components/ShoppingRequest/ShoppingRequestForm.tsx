"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus as PlusIcon, Trash2 as TrashIcon } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { createShoppingRequest, createShoppingRequestProduct } from "@/lib/api.service";
import { ROUTES, ASSISTED_SHOPPING_PRODUCT_LINK_KEY } from "@/utils/constants";

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const productLink = sessionStorage.getItem(ASSISTED_SHOPPING_PRODUCT_LINK_KEY);
      
      if (productLink) {
        setItems((prevItems) => {
          const newItems = [...prevItems];
          if (newItems.length > 0) {
            newItems[0].url = productLink;
          }
          return newItems;
        });
        sessionStorage.removeItem(ASSISTED_SHOPPING_PRODUCT_LINK_KEY);
      }
    }
  }, []);

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

    //TODO: revert hardcoded values
    const shoppingRequest = {
      user_id: userId,
      request_code: `SR/IN/${Date.now()}`,
      courier_id: "0f502386-b904-4cb8-8861-6c32e900bd84",
      items_count: items.length,
      remarks,
      status: "REQUESTED",
    };

    try {
      const requestRes = await createShoppingRequest(shoppingRequest);
      const requestId = requestRes.id;

      await Promise.allSettled(
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

      router.push(ROUTES.ASSISTED_SHOPPING);
    } catch (error) {
      console.error("Error creating shopping request:", error);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 md:p-8 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 sm:space-y-6">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 sm:p-5 md:p-6 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">{index + 1}.</h3>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 sm:p-2 text-red-500 hover:bg-red-50 rounded-md sm:rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
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

        <div className="mt-4 sm:mt-6">
          <button
            type="button"
            onClick={handleAddNewItem}
            className="bg-purple-700 text-white px-4 sm:px-5 md:px-6 py-2.5 md:py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-purple-600 transition-colors shadow-sm hover:shadow-md"
          >
            <PlusIcon className="w-4 h-4 md:w-5 md:h-5" />
            Add New Link
          </button>
        </div>

        <div className="mt-4 sm:mt-6">
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

        <div className="flex justify-end mt-6 sm:mt-8">
          <button
            type="submit"
            disabled={loading}
            className={`bg-purple-700 text-white px-6 sm:px-8 md:px-10 py-3 md:py-3.5 rounded-lg text-sm font-medium transition-all duration-200 w-full sm:w-auto shadow-sm hover:shadow-md
              ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-600"}`}
          >
            {loading ? (
              <div className="flex items-center gap-2 justify-center">
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
