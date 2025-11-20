"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Container, Typography } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { useCart, useCartActions, useProductActions } from "../../../store/ecommerceStore";
import { useEffectiveUserLocation } from "@/hooks/useEffectiveUserLocation";
import { fetchUserAddresses, createUserAddress, updateUserAddress } from "@/lib/api.service";
import CartHeader from "@/components/ecommerce/cart/CartHeader";
import AddAddressModal from "@/components/ecommerce/cart/AddAddressModal";
import CartItemsList from "@/components/ecommerce/cart/CartItemsList";
import OrderSummaryCard from "@/components/ecommerce/cart/OrderSummaryCard";
import EmptyCartState from "@/components/ecommerce/cart/EmptyCartState";
import CartSkeletonLoader from "@/components/ecommerce/cart/CartSkeletonLoader";
import ContinueShoppingCard from "@/components/ecommerce/cart/ContinueShoppingCard";
import AddressSection from "@/components/ecommerce/cart/AddressSection";
import { ecommerceData } from "@/data/ecommerceData";
import { ROUTES } from "@/utils/constants";
import { getCurrencyForCountry } from "@/utils/currency";
import { getCartItemPricingSummary } from "@/utils/priceUtils";
import { CartItemLoadingState, CartAddressData } from "@/types/ecommerce";

export default function CartPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { cart, itemCount } = useCart();
  const { updateCartItem, removeFromCart, fetchCart, syncLocalCartToServer } = useCartActions();
  const { fetchProducts } = useProductActions();

  const [loadingStates, setLoadingStates] = useState<Record<string, CartItemLoadingState>>({});
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedAddress, setSelectedAddress] = useState<CartAddressData | null>(null);
  const [addAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<CartAddressData | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [highlightAddressError, setHighlightAddressError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { location, refreshAddresses } = useEffectiveUserLocation({
    countryCode: undefined,
    countryName: undefined,
    city: '',
    pincode: '',
  });
  const selectedCountry = location.countryName;

  const userId = (session?.user as any)?.user_id;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const loadAddressesInternal = useCallback(async (uid: string) => {
    try {
      const addressData = await fetchUserAddresses(uid);
      let formattedAddress: CartAddressData | null = null;
      if (addressData) {
        formattedAddress = {
          id: addressData.id,
          name: addressData.name || "",
          address: addressData.address || "",
          city: addressData.city || "",
          state: addressData.state || "",
          zip_code: addressData.zip_code || "",
          country: addressData.country || "",
          phone_code: addressData.user.phone_code,
          phone_number: addressData.user.phone_number,
          email: addressData.user.email,
        };
      }
      setSelectedAddress(formattedAddress);
    } catch (err) {
      console.error("Failed to load addresses:", err);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (!selectedCountry) return;

    const init = async () => {
      setIsPageLoading(true);
      try {
        const promises = [];

        if (selectedCountry) {
          promises.push(fetchProducts(selectedCountry));
        }

        const cartTask = async () => {
            if (selectedCountry) {
                if (userId) {
                    await syncLocalCartToServer(selectedCountry);
                }
                await fetchCart(selectedCountry);
            }
        };
        promises.push(cartTask());

        if (userId) {
            promises.push(loadAddressesInternal(userId));
        }

        await Promise.all(promises);

      } catch (e) {
        console.error("Initialization error:", e);
      } finally {
        setIsPageLoading(false);
      }
    };

    init();
  }, [selectedCountry, userId, status, fetchProducts, syncLocalCartToServer, fetchCart, loadAddressesInternal]);

  useEffect(() => {
    if (cart && cart.items.length > 0) {
      setSelectedItems((prev) => {
         if (prev.size === 0) return new Set(cart.items.map((item) => item.id));
         return prev;
      });
    }
  }, [cart]);


  const handleSaveAddress = async (addressData: Omit<CartAddressData, "id">) => {
    if (!userId) return;
    try {
      const apiData = {
        user_id: userId,
        name: addressData.name,
        address: addressData.address,
        country: addressData.country,
        zip_code: addressData.zip_code,
        state: addressData.state,
        city: addressData.city,
        phone_number: `${addressData.phone_code || ''}${addressData.phone_number || ''}`,
        email: addressData.email,
      };
      const newAddress = await createUserAddress(apiData);
      const formattedAddress: CartAddressData = {
        id: newAddress.id,
        ...addressData,
      };
      setSelectedAddress(formattedAddress);
      await refreshAddresses();
    } catch (err) {
      console.error("Failed to save address:", err);
      throw err;
    }
  };

  const handleUpdateAddress = async (addressId: string, addressData: Omit<CartAddressData, "id">) => {
    if (!userId) return;
    try {
      const apiData = {
        user_id: userId,
        name: addressData.name,
        address: addressData.address,
        country: addressData.country,
        zip_code: addressData.zip_code,
        state: addressData.state,
        city: addressData.city,
        phone_number: `${addressData.phone_code || ''}${addressData.phone_number || ''}`,
        email: addressData.email,
      };
      const updatedAddress = await updateUserAddress(addressId, apiData);
      const formattedAddress: CartAddressData = {
        id: addressId,
        ...addressData,
      };
      setSelectedAddress(formattedAddress);
      setEditAddress(null);
      await refreshAddresses();
    } catch (err) {
      console.error("Failed to update address:", err);
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
        await removeFromCart(itemId, selectedCountry);
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
        await updateCartItem(itemId, newQuantity, selectedCountry);
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
  }, [cart, updateCartItem, removeFromCart, selectedCountry]);

  const handleRemoveItem = useCallback(async (itemId: string) => {
    setLoadingStates((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], isRemoveLoading: true },
    }));
    try {
      await removeFromCart(itemId, selectedCountry);
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setLoadingStates((prev) => {
        const newState = { ...prev };
        delete newState[itemId];
        return newState;
      });
    }
  }, [removeFromCart, selectedCountry]);

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

    if (!userId) {
      toast.info("Please sign in to continue with checkout");
      router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
    } else if (!selectedAddress) {
      toast.error("Please add a delivery address to continue with checkout.");
      setHighlightAddressError(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setHighlightAddressError(false);
        timeoutRef.current = null;
      }, 3000);
    } else {
      router.push(ROUTES.CHECKOUT);
    }
  }, [router, selectedItems, cart, userId, selectedAddress, pathname]);

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
  if (isPageLoading || status === "loading" || !selectedCountry || cart === undefined) {
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
                  To select or add an address, please{' '}
                  <Typography 
                    component="span" 
                    variant="body2"
                    sx={{ 
                      color: "primary.main", 
                      cursor: "pointer", 
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                    onClick={() => router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`)}
                  >
                    login
                  </Typography>.
                </Typography>
              </Box>
            ) : (
              <AddressSection
                selectedAddress={selectedAddress}
                highlightAddressError={highlightAddressError}
                onAddAddress={() => setAddAddressModalOpen(true)}
                onEditAddress={() => {
                  setEditAddress(selectedAddress);
                  setEditModalOpen(true);
                }}
                noAddressLabel="No Address Found"
                addAddressLabel="+ Add Address"
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
        initialData={null}
        onClose={() => setAddAddressModalOpen(false)}
        onSave={handleSaveAddress}
        title="Add New Address"
        saveLabel="Save Address"
        cancelLabel="Cancel"
      />

      <AddAddressModal
        open={editModalOpen}
        initialData={editAddress}
        onClose={() => {
          setEditModalOpen(false);
          setEditAddress(null);
        }}
        onSave={(data) => handleUpdateAddress(editAddress!.id, data)}
        title="Edit Address"
        saveLabel="Update Address"
        cancelLabel="Cancel"
      />
    </Box>
  );
}