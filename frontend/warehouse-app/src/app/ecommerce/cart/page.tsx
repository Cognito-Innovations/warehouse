"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Container, Typography } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { useCart, useCartActions } from "../../../store/ecommerceStore";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import { fetchUserAddresses, createUserAddress } from "@/lib/api.service";
import CartHeader from "@/components/ecommerce/cart/CartHeader";
import AddressSelectionDropdown from "@/components/ecommerce/cart/AddressSelectionDropdown";
import AddAddressModal from "@/components/ecommerce/cart/AddAddressModal";
import CartItemsList from "@/components/ecommerce/cart/CartItemsList";
import OrderSummaryCard from "@/components/ecommerce/cart/OrderSummaryCard";
import EmptyCartState from "@/components/ecommerce/cart/EmptyCartState";
import CartSkeletonLoader from "@/components/ecommerce/cart/CartSkeletonLoader";
import ContinueShoppingCard from "@/components/ecommerce/cart/ContinueShoppingCard";
import { ecommerceData } from "@/data/ecommerceData";
import { ROUTES } from "@/utils/constants";
import { getCurrencyForCountry } from "@/utils/currency";
import { getCartItemPricingSummary } from "@/utils/priceUtils";
import { CartItemLoadingState, CartAddressData } from "@/types/ecommerce";

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
    countryCode: undefined,
    countryName: undefined,
    city: '',
    pincode: '',
  });
  const selectedCountry = locationData.location.countryName;
  const countryCode = locationData.location.countryCode;

  const userId = (session?.user as any)?.user_id;

  useEffect(() => {
    if (countryCode) {
      fetchCart(countryCode);
    }
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
        await removeFromCart(itemId, countryCode);
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
        await updateCartItem(itemId, newQuantity, countryCode);
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
      await removeFromCart(itemId, countryCode);
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
    const selectedCartItems = cart?.items.filter((item) => selectedItems.has(item.id)) || [];   

    localStorage.setItem("checkoutSelectedItems", JSON.stringify(selectedCartItems));

    if (userId) {
      router.push(ROUTES.CHECKOUT);
    } else {
      toast.info("Please sign in to continue with checkout");
      router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(ROUTES.CHECKOUT)}`);
    }
  }, [router, selectedItems, cart, userId]);

  const handleContinueShopping = useCallback(() => {
    router.push(ROUTES.ECOMMERCE);
  }, [router]);

  const getThresholdAndFees = (country?: string) => {
    if (country && country.includes('India')) {
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

    const { threshold, deliveryFee: deliveryBase, serviceCharge: serviceBase } =
      getThresholdAndFees(selectedCountry);

    const selectedCartItems =
      cart.items.filter((item) => selectedItems.has(item.id)) ?? [];

    if (selectedCartItems.length === 0) {
      return { subtotal: 0, discount: 0, deliveryFee: 0, taxes: 0, serviceCharge: 0, total: 0 };
    }

    let grossSubtotal = 0;
    let discountAmount = 0;

    selectedCartItems.forEach((item) => {
      const pricing = getCartItemPricingSummary(item);
      const lineOriginalTotal = pricing.originalUnitPrice * pricing.quantity;
      grossSubtotal += lineOriginalTotal;
      discountAmount += pricing.discountTotal;
    });

    const discountedSubtotal = grossSubtotal - discountAmount;
    const deliveryFee = discountedSubtotal >= threshold ? 0 : deliveryBase;
    const taxes = discountedSubtotal * 0.02; // 2% tax
    const serviceCharge = serviceBase;
    const total = discountedSubtotal + deliveryFee + taxes + serviceCharge;
    const asAmount = (value: number) => Number(value.toFixed(2));

    return {
      subtotal: asAmount(grossSubtotal),
      discount: asAmount(discountAmount),
      deliveryFee: asAmount(deliveryFee),
      taxes: asAmount(taxes),
      serviceCharge: asAmount(serviceCharge),
      total: asAmount(total),
    };
  }, [cart, selectedItems, selectedCountry]);

  // Show skeleton loader while cart is loading and no cart data exists
  if (cartLoading && !cart) {
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

  const getCurrencySymbol = () => {
    if (cart && cart.items.length > 0) {
      const firstSelected = cart.items.find((item) => selectedItems.has(item.id)) || cart.items[0];
      const pricing = getCartItemPricingSummary(firstSelected);
      if (pricing.currency) {
        return pricing.currency;
      }
    }
    return currencyInfo.symbol;
  };

  const totals = calculateSelectedTotals();
  const currencyInfo = getCurrencyForCountry(selectedCountry!);
  const currencySymbol = getCurrencySymbol();

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
            {!userId ? (
              <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>Address</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  To select or add an address, please login.
                </Typography>
              </Box>
            ) : addresses.length === 0 ? (
              <Box sx={{ p: 2, border: "1px solid #ddd", borderRadius: 2, mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>No Address Found</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Add your delivery address to continue.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 2, color: "primary.main", cursor: "pointer", fontWeight: 600 }}
                  onClick={() => setAddAddressModalOpen(true)}
                >
                  + Add Address
                </Typography>
              </Box>
              ) : (
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
              )}

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