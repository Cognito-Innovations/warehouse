"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Container } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart, useCartActions } from "../../../store/ecommerceStore";
import { ROUTES } from "@/utils/constants";
import { ecommerceData } from "@/data/ecommerceData";
import { CartItemLoadingState, CartAddressData } from "@/types/ecommerce";
import { fetchUserAddresses, createUserAddress } from "@/lib/api.service";
import CartHeader from "@/components/ecommerce/cart/CartHeader";
import AddressSelectionDropdown from "@/components/ecommerce/cart/AddressSelectionDropdown";
import AddAddressModal from "@/components/ecommerce/cart/AddAddressModal";
import CartItemsList from "@/components/ecommerce/cart/CartItemsList";
import OrderSummaryCard from "@/components/ecommerce/cart/OrderSummaryCard";
import EmptyCartState from "@/components/ecommerce/cart/EmptyCartState";
import CartSkeletonLoader from "@/components/ecommerce/cart/CartSkeletonLoader";
import ContinueShoppingCard from "@/components/ecommerce/cart/ContinueShoppingCard";
import { getCurrencyForCountry, getUserCountry } from "@/utils/currency";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import { parsePrice, formatPrice, calculateDiscountedPrice } from "@/utils/priceUtils";

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { cart, itemCount, loading: cartLoading } = useCart();
  const { updateCartItem, removeFromCart, fetchCart } = useCartActions();

  const [loadingStates, setLoadingStates] = useState<Record<string, CartItemLoadingState>>({});
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [addresses, setAddresses] = useState<CartAddressData[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<CartAddressData | null>(null);
  const [addAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  const locationData = useEffectiveUserLocation({
    country: 'United States of America',
    city: 'New York',
    pincode: '10001',
  });
  const selectedCountry = locationData.location.country;

  const userId = (session?.user as any)?.user_id;

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (cart && cart.items.length > 0) {
      setSelectedItems(new Set(cart.items.map((item) => item.id)));
    }
  }, [cart])

  useEffect(() => {
    if (userId) {
      loadAddresses();
    }
  }, [userId]);

  const loadAddresses = async () => {
    if (!userId) return;
    setLoadingAddresses(true);
    try {
      const addressData = await fetchUserAddresses(userId);
      if (addressData) {
        const formattedAddresses: CartAddressData[] = Array.isArray(addressData)
          ? addressData.map((addr: any) => ({
              id: addr.id,
              name: addr.name || "",
              address: addr.address || "",
              city: addr.city || "",
              state: addr.state || "",
              zip_code: addr.zip_code || "",
              country: addr.country || "",
              phone_number: addr.phone_number,
              email: addr.email,
            }))
          : [
              {
                id: addressData.id,
                name: addressData.name || "",
                address: addressData.address || "",
                city: addressData.city || "",
                state: addressData.state || "",
                zip_code: addressData.zip_code || "",
                country: addressData.country || "",
                phone_number: addressData.phone_number,
                email: addressData.email,
              },
            ];
        setAddresses(formattedAddresses);
        if (formattedAddresses.length > 0 && !selectedAddress) {
          setSelectedAddress(formattedAddresses[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleSaveAddress = async (addressData: Omit<CartAddressData, "id">) => {
    if (!userId) return;
    try {
      // Only send fields that the API expects
      const apiData = {
        user_id: userId,
        name: addressData.name,
        address: addressData.address,
        country: addressData.country,
        zip_code: addressData.zip_code,
        state: addressData.state,
        city: addressData.city,
      };
      const newAddress = await createUserAddress(apiData);
      const formattedAddress: CartAddressData = {
        id: newAddress.id,
        ...addressData,
      };
      setAddresses((prev) => [...prev, formattedAddress]);
      setSelectedAddress(formattedAddress);
    } catch (err) {
      console.error("Failed to save address:", err);
      throw err;
    }
  };

  const handleQuantityChange = useCallback(async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setLoadingStates((prev) => ({
        ...prev,
        [itemId]: { ...prev[itemId], isDecrementLoading: true },
      }));
      try {
        await removeFromCart(itemId);
      } catch (err) {
        console.error("Failed to remove item:", err);
      } finally {
        setLoadingStates((prev) => {
          const newState = { ...prev };
          delete newState[itemId];
          return newState;
        });
      }
    } else {
      const isIncrement = newQuantity > (cart?.items.find((item) => item.id === itemId)?.quantity || 0);
      setLoadingStates((prev) => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          isIncrementLoading: isIncrement,
          isDecrementLoading: !isIncrement,
        },
      }));
      try {
        await updateCartItem(itemId, newQuantity);
      } catch (err) {
        console.error("Failed to update quantity:", err);
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          [itemId]: {
            ...prev[itemId],
            isIncrementLoading: false,
            isDecrementLoading: false,
          },
        }));
      }
    }
  }, [cart, updateCartItem, removeFromCart]);

  const handleRemoveItem = useCallback(async (itemId: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], isRemoveLoading: true },
    }));
    try {
      await removeFromCart(itemId);
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setLoadingStates((prev) => {
        const newState = { ...prev };
        delete newState[itemId];
        return newState;
      });
    }
  }, [removeFromCart]);

  const handleItemSelect = useCallback((itemId: string, selected: boolean) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(itemId);
      } else {
        newSet.delete(itemId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedItems(new Set(cart?.items.map((item) => item.id) || []));
    } else {
      setSelectedItems(new Set());
    }
  }, [cart]);

  const handleCheckout = useCallback(() => {
    router.push(ROUTES.CHECKOUT);
  }, [router]);

  const handleContinueShopping = useCallback(() => {
    router.push(ROUTES.ECOMMERCE);
  }, [router]);

  const getThresholdAndFees = (country: string) => {
    if (country.includes('India')) {
      return { threshold: 299, deliveryFee: 3, serviceCharge: 1 };
    } else {
      return { threshold: 20, deliveryFee: 5, serviceCharge: 1 };
    }
  };

  // Calculate totals for all items in cart (in local currency)
  const calculateSelectedTotals = useCallback(() => {
  if (!cart || !cart.items || cart.items.length === 0) {
    return { subtotal: 0, discount: 0, deliveryFee: 0, taxes: 0, serviceCharge: 0, total: 0 };
  }

  const { threshold, deliveryFee: deliveryBase, serviceCharge: serviceBase } = getThresholdAndFees(selectedCountry);

  // Filter to selected items only
  const selectedCartItems = cart.items.filter((item) => selectedItems.has(item.id));

  if (selectedCartItems.length === 0) {
    // No items selected: all zeros (including no delivery/service)
    return { subtotal: 0, discount: 0, deliveryFee: 0, taxes: 0, serviceCharge: 0, total: 0 };
  }

  // Calculate subtotal from SELECTED items: quantity × unit_price
  const subtotal = selectedCartItems.reduce((sum, item) => {
    const itemUnitPrice = Number(item.unit_price) || 0;
    const itemLineTotal = (item.quantity || 0) * itemUnitPrice;
    return sum + itemLineTotal;
  }, 0);

  // Ensure all calculations use valid numbers
  const discountAmount = Number(cart.discount_percentage) || 0;
  const deliveryFee = subtotal >= threshold ? 0 : deliveryBase;
  const taxes = subtotal * 0.02; // 2% tax
  const serviceCharge = serviceBase;
  const total = subtotal - discountAmount + deliveryFee + taxes + serviceCharge;

  // Ensure no NaN values
  return {
    subtotal: isNaN(subtotal) ? 0 : subtotal,
    discount: isNaN(discountAmount) ? 0 : discountAmount,
    deliveryFee: isNaN(deliveryFee) ? 0 : deliveryFee,
    taxes: isNaN(taxes) ? 0 : taxes,
    serviceCharge: isNaN(serviceCharge) ? 0 : serviceCharge,
    total: isNaN(total) ? 0 : total,
  };
}, [cart, selectedItems, selectedCountry]);

  // Show skeleton loader while cart is loading
  if (cartLoading) {
    return <CartSkeletonLoader />;
  }

  // Show empty cart state
  if (!cart || cart.items.length === 0) {
    return (
      <EmptyCartState
        icon={<ShoppingCart sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />}
        title={ecommerceData.cart.emptyCart.title}
        description={ecommerceData.cart.emptyCart.description}
        buttonLabel={ecommerceData.cart.emptyCart.buttonLabel}
        onButtonClick={() => router.push(ROUTES.ECOMMERCE)}
        buttonColor={ecommerceData.ui.colors.bottomNavCart}
      />
    );
  }

  const totals = calculateSelectedTotals();
  const currencyInfo = getCurrencyForCountry(selectedCountry);
  const currencySymbol = cart.items.length > 0 ? parsePrice(cart.items[0].product.price).currency : currencyInfo.symbol;

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
      <CartHeader
        title={ecommerceData.cart.title}
        itemCount={itemCount}
        onBackClick={() => router.back()}
      />

      <Container maxWidth="lg" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          {/* Cart Items Section */}
          <Box sx={{ flex: { md: "0 0 65%" }, width: { xs: "100%", md: "65%" } }}>
            <AddressSelectionDropdown
              addresses={addresses}
              selectedAddress={selectedAddress}
              onAddressSelect={setSelectedAddress}
              onAddNewAddress={() => setAddAddressModalOpen(true)}
              noAddressLabel={ecommerceData.cart.addressSelection.noAddressLabel}
              addAddressLabel={ecommerceData.cart.addressSelection.addAddressLabel}
              selectAddressLabel={ecommerceData.cart.addressSelection.selectAddressLabel}
              borderColor={ecommerceData.ui.colors.borderColor}
            />

            <CartItemsList
              items={cart.items}
              loadingStates={loadingStates}
              selectedItems={selectedItems}
              onItemSelect={handleItemSelect}
              onSelectAll={handleSelectAll}
              onQuantityChange={handleQuantityChange}
              onRemoveItem={handleRemoveItem}
              title={ecommerceData.cart.cartItems.title}
              discountBadgeColor={ecommerceData.ui.colors.discountBadge}
              borderColor={ecommerceData.ui.colors.borderColor}
              currencySymbol={currencySymbol}
              selectedCountry={selectedCountry}
            />

            <ContinueShoppingCard
              label={ecommerceData.cart.continueShopping.label}
              onClick={handleContinueShopping}
              borderColor={ecommerceData.ui.colors.borderColor}
            />
          </Box>

          {/* Order Summary Section */}
          <Box sx={{ flex: { md: "0 0 35%" }, width: { xs: "100%", md: "35%" } }}>
            <OrderSummaryCard
              subtotal={totals.subtotal}
              discount={totals.discount}
              deliveryFee={totals.deliveryFee}
              taxes={totals.taxes}
              serviceCharge={totals.serviceCharge}
              total={totals.total}
              checkoutLabel={ecommerceData.cart.orderSummary.checkoutLabel}
              onCheckout={handleCheckout}
              borderColor={ecommerceData.ui.colors.borderColor}
              currencySymbol={currencySymbol}
            />
          </Box>
        </Box>
      </Container>

      <AddAddressModal
        open={addAddressModalOpen}
        onClose={() => setAddAddressModalOpen(false)}
        onSave={handleSaveAddress}
        title="Add New Address"
        saveLabel="Save Address"
        cancelLabel="Cancel"
      />
    </Box>
  );
}