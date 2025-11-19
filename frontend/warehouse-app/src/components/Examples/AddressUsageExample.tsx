"use client";
import React, { useState } from "react";
import { useAddressForm } from "../../hooks/useAddressForm";

/**
 * Example component showing how to use the address context
 * This can be used in any component that needs address data
 */
const AddressUsageExample: React.FC = () => {
  const {
    selectedCountry,
    selectedAddress,
    currentCountryInfo,
    savedAddresses,
    getPickupRequestData,
    getShoppingRequestData,
    selectCountry,
    selectAddress,
    updateAddress,
    addAddress,
  } = useAddressForm();

  // Form state for editing address
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    phone_number: "",
  });

  const handleCreatePickupRequest = async () => {
    // Example: Create pickup request with current address data
    const pickupData = getPickupRequestData({
      user_id: "user-123",
      pickup_address: selectedAddress?.address || "",
      supplier_name: "Example Supplier",
      supplier_phone_number: selectedAddress?.phone_number || "",
      pcs_box: "2",
      pkg_details: "Electronics",
    });

    console.log("Pickup Request Data:", pickupData);
    // Now you can call your API with this data
  };

  const handleCreateShoppingRequest = async () => {
    // Example: Create shopping request with current address data
    const shoppingData = getShoppingRequestData({
      user_id: "user-123",
      items: ["Item 1", "Item 2"],
      total_amount: 100,
    });

    console.log("Shopping Request Data:", shoppingData);
    // Now you can call your API with this data
  };

  const handleUpdateAddress = () => {
    if (!selectedAddress) return;
    
    // Example: Update the current selected address
    const updatedAddress = {
      ...selectedAddress,
      name: "Updated Company Name",
      address: "Updated Address, New City",
      phone_number: "+65-9876-5432",
    };
    
    updateAddress(updatedAddress);
    console.log("Address updated:", updatedAddress);
  };

  const handleAddNewAddress = () => {
    // Example: Add a new address
    const newAddress = {
      country_id: "country-id-1",
      id: `address-${Date.now()}`, // Generate unique ID
      name: "New Company",
      address: "123 New Street, Singapore",
      country_name: "Singapore",
      country_code: "SG",
      country_phone_code: "+65",
      phone_number: "+65-1234-5678",
    };
    
    addAddress(newAddress);
    console.log("New address added:", newAddress);
  };

  const handleSelectDifferentAddress = () => {
    if (savedAddresses.length > 1) {
      // Example: Select a different address from saved addresses
      const nextAddress = savedAddresses.find((addr: any) => addr.id !== selectedAddress?.id) || savedAddresses[0];
      selectAddress(nextAddress);
      console.log("Selected different address:", nextAddress);
    }
  };

  const handleStartEdit = () => {
    if (selectedAddress) {
      setEditForm({
        name: selectedAddress.name,
        address: selectedAddress.address,
        phone_number: selectedAddress.phone_number,
      });
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    if (selectedAddress) {
      const updatedAddress = {
        ...selectedAddress,
        ...editForm,
      };
      updateAddress(updatedAddress);
      setIsEditing(false);
      console.log("Address updated via form:", updatedAddress);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      name: "",
      address: "",
      phone_number: "",
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Address Context Usage Example</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Current Country:</h3>
          <p>{selectedCountry} ({currentCountryInfo?.code})</p>
        </div>
        
        <div>
          <h3 className="font-semibold">Selected Address:</h3>
          {isEditing ? (
            <div className="space-y-2 p-4 bg-gray-50 rounded">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name:</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address:</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
                <input
                  type="text"
                  value={editForm.phone_number}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone_number: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p>{selectedAddress?.name || "No address selected"}</p>
              <p>{selectedAddress?.address || ""}</p>
              <p className="text-sm text-gray-500">
                Phone: {selectedAddress?.phone_number || "N/A"}
              </p>
              {selectedAddress && (
                <button
                  onClick={handleStartEdit}
                  className="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit Address
                </button>
              )}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-semibold">Saved Addresses ({savedAddresses.length}):</h3>
          <div className="max-h-32 overflow-y-auto">
            {savedAddresses.map((addr: any, index: number) => (
              <div key={addr.id || index} className="text-sm p-2 bg-gray-50 rounded mb-1">
                <p className="font-medium">{addr.name}</p>
                <p className="text-gray-600">{addr.address}</p>
                <p className="text-gray-500">{addr.country_name} - {addr.phone_number}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => selectCountry("Singapore")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Select Singapore
          </button>
          <button
            onClick={() => selectCountry("India")}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Select India
          </button>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold">Address Management:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleUpdateAddress}
              disabled={!selectedAddress}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Update Current Address
            </button>
            <button
              onClick={handleAddNewAddress}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add New Address
            </button>
            <button
              onClick={handleSelectDifferentAddress}
              disabled={savedAddresses.length <= 1}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Select Different Address
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold">API Examples:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCreatePickupRequest}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Create Pickup Request
            </button>
            <button
              onClick={handleCreateShoppingRequest}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Create Shopping Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressUsageExample;
