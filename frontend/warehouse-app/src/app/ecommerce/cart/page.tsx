"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, Container } from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { useCartStore } from "@/store/cartStore";
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
import CartLoginState from "@/components/ecommerce/cart/CartLoginState";
import OrderSummarySkeleton from "@/components/ecommerce/skeleton-loader/OrderSummarySkeleton";
import CartItemsSkeleton from "@/components/ecommerce/skeleton-loader/CartItemsSkeleton";
import { ecommerceData } from "@/data/ecommerceData";
import { ROUTES } from "@/utils/constants";
import { getCurrencyForCountry } from "@/utils/currency";
import { getCartItemPricingSummary } from "@/utils/priceUtils";
import { calculateCartTotals } from "@/utils/cartCalculations";
import { CartAddressData } from "@/types/ecommerce";

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const {
    cartProducts,
    getCart,
    removeProductFromCart,
    setCartItemQuantity,
    checkoutProducts,
    toggleCartItemSelection,
    clearCheckoutProducts,
    cartProductQuantityCount,
  } = useCartStore();

  const [selectedAddress, setSelectedAddress] = useState<CartAddressData | null>(null);
  const [addAddressModalOpen, setAddAddressModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<CartAddressData | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [highlightAddressError, setHighlightAddressError] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false); 
  const [isAddressLoading, setIsAddressLoading] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { location, refreshAddresses } = useEffectiveUserLocation({
    countryCode: undefined,
    countryName: undefined,
    city: '',
    pincode: '',
  });
  const selectedCountry = location.countryName;

  const userId = (session?.user as any)?.user_id;
  const borderColor = ecommerceData.ui.colors.borderColor;

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

  const init = async () => {
    if (userId) {
      setIsAddressLoading(true);
      loadAddressesInternal(userId).finally(() => setIsAddressLoading(false));
    }
    try {
      if (cartProducts.length === 0) {
        setIsCartLoading(true);
      }
      await getCart(selectedCountry);
    } catch (e) {
      console.error("Initialization error:", e);
    } finally {
      setIsCartLoading(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!selectedCountry) return;
    init();
  }, [selectedCountry, userId, status]);

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
      await updateUserAddress(addressId, apiData);
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

  const handleQuantityChange = useCallback(async (identifier: string, newQuantity: number) => {
    await setCartItemQuantity(identifier, newQuantity, selectedCountry);
  }, [setCartItemQuantity, selectedCountry]);

  const handleRemoveItem = useCallback(async (identifier: string) => {
    await removeProductFromCart(identifier, selectedCountry);
  }, [removeProductFromCart, selectedCountry]);

  const handleItemSelect = (itemId: string, isChecked: boolean) => {
    const isCurrentlySelected = checkoutProducts.includes(itemId);
    if (isChecked !== isCurrentlySelected) {
      toggleCartItemSelection(itemId);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = cartProducts
        .map(i => i.product_id)
        .filter((id): id is string => !!id);

      const unselectedIds = allIds.filter(id => !checkoutProducts.includes(id));
      if (unselectedIds.length > 0) {
        toggleCartItemSelection(unselectedIds);
      }
    } else {
      clearCheckoutProducts();
    }
  };

  const handleCheckout = useCallback(() => {
    const selected = cartProducts.filter(item =>
      checkoutProducts.includes(item.product_id!) || checkoutProducts.includes(item.id!)
    );

    if (selected?.length === 0) {
      toast.error("Please select items to checkout");
      return;
    }

    if (!userId) {
      localStorage.setItem("checkoutSelectedItems", JSON.stringify(selected));
      toast.info("Please sign in to continue with checkout");
      router.push(`/api/auth/signin?callbackUrl=${encodeURIComponent(ROUTES.CHECKOUT)}`);
      return;
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
      localStorage.setItem("checkoutSelectedItems", JSON.stringify(selected));
      router.push(ROUTES.CHECKOUT);
    }
  }, [router, cartProducts, userId, selectedAddress, checkoutProducts]); // ROUTES.CHECKOUT constant used directly

  const handleContinueShopping = useCallback(() => {
    router.push(ROUTES.ECOMMERCE);
  }, [router]);

  if (status === "loading") {
    return <CartSkeletonLoader />;
  }

  if (!isCartLoading && (!cartProducts || cartProducts.length === 0)) {
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

  const validItems = cartProducts.filter(item => item && item.product);

  const getCurrencySymbol = () => {
    if (validItems.length > 0) {
      const firstSelected = validItems.find((item) =>
        checkoutProducts.includes(item.product_id!)
      );
      
      if (firstSelected) {
        const pricing = getCartItemPricingSummary(firstSelected);
        if (pricing.currency) return pricing.currency;
      }
    }
    return currencyInfo.symbol;
  };

  const totals = calculateCartTotals(validItems, new Set(checkoutProducts), selectedCountry);
  const currencyInfo = getCurrencyForCountry(selectedCountry!);
  const currencySymbol = getCurrencySymbol();

  return (
    <Box sx={{ bgcolor: "grey.50", minHeight: "100vh" }}>
      <CartHeader
        title={ecommerceData.cart.title}
        itemCount={cartProductQuantityCount()}
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
              <CartLoginState />
            ) : (
              <AddressSection
                selectedAddress={selectedAddress}
                highlightAddressError={highlightAddressError}
                isLoading={isAddressLoading}
                onAddAddress={() => setAddAddressModalOpen(true)}
                onEditAddress={() => {
                  setEditAddress(selectedAddress);
                  setEditModalOpen(true);
                }}
                noAddressLabel="No Address Found"
                addAddressLabel="+ Add Address"
                borderColor={borderColor}
              />
            )}
            {isCartLoading ? (
              <CartItemsSkeleton borderColor={borderColor} />
            ) : (
              <CartItemsList
                items={validItems}
                selectedItems={new Set(checkoutProducts)}
                onItemSelect={handleItemSelect}
                onSelectAll={handleSelectAll}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
                title={ecommerceData.cart.cartItems.title}
                discountBadgeColor={ecommerceData.ui.colors.discountBadge}
                borderColor={borderColor}
                currencySymbol={currencySymbol}
                selectedCountry={selectedCountry}
              />
            )}

            <ContinueShoppingCard
              label={ecommerceData.cart.continueShopping.label}
              onClick={handleContinueShopping}
              borderColor={borderColor}
            />
          </Box>

          {/* Order Summary Section */}
          <Box sx={{ flex: { md: "0 0 35%" }, width: { xs: "100%", md: "35%" } }}>
            {isCartLoading ? (
              <OrderSummarySkeleton borderColor={borderColor} />
            ) : (
              <OrderSummaryCard
                subtotal={totals.subtotal}
                discount={totals.discount}
                deliveryFee={totals.deliveryFee}
                taxes={totals.taxes}
                serviceCharge={totals.serviceCharge}
                total={totals.total}
                checkoutLabel={ecommerceData.cart.orderSummary.checkoutLabel}
                onCheckout={handleCheckout}
                borderColor={borderColor}
                currencySymbol={currencySymbol}
              />
            )}
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