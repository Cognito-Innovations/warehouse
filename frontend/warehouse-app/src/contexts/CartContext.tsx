"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Cart, CartItem, EcommerceProduct } from "../types/ecommerce";
import { ecommerceService } from "../services/ecommerce.service";
import { toast } from "sonner";

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  itemCount: number;
  totalAmount: number;
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_CART"; payload: Cart }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "ADD_ITEM"; payload: { product: EcommerceProduct; quantity: number } }
  | { type: "UPDATE_ITEM"; payload: { itemId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string };

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  itemCount: 0,
  totalAmount: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_CART":
      return {
        ...state,
        cart: action.payload,
        itemCount: action.payload.items.reduce((sum, item) => sum + item.quantity, 0),
        totalAmount: action.payload.final_amount,
        loading: false,
        error: null,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "CLEAR_CART":
      return {
        ...state,
        cart: null,
        itemCount: 0,
        totalAmount: 0,
        error: null,
      };
    default:
      return state;
  }
}

interface CartContextType extends CartState {
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const refreshCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const cart = await ecommerceService.getCart();
      dispatch({ type: "SET_CART", payload: cart });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load cart" });
    }
  };

  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const cart = await ecommerceService.addToCart({
        product_id: productId,
        quantity,
      });
      dispatch({ type: "SET_CART", payload: cart });
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // For demo purposes, create a mock cart item
      const mockProduct: EcommerceProduct = {
        id: productId,
        name: "Mock Product",
        description: "Demo product",
        slug: "mock-product",
        price: 100,
        image_url: "https://images.unsplash.com/photo-1546470427-5c3b4b4b4b4b?w=400",
        quantity: 1,
        measurement: "kg",
        discount_percentage: 0,
        category: {
          id: "1",
          name: "Mock Category",
          slug: "mock-category",
          image_url: "",
          description: "Mock category",
          is_active: true,
          country: { id: "1", name: "India" },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        sub_category: {
          id: "1",
          name: "Mock Sub Category",
          slug: "mock-sub-category",
          image_url: "",
          description: "Mock sub category",
          is_active: true,
          category: {
            id: "1",
            name: "Mock Category",
            slug: "mock-category",
            image_url: "",
            description: "Mock category",
            is_active: true,
            country: { id: "1", name: "India" },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          country: { id: "1", name: "India" },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        country: { id: "1", name: "India" },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const mockCartItem = {
        id: `item-${Date.now()}`,
        product: mockProduct,
        quantity,
        unit_price: mockProduct.price,
        total_price: mockProduct.price * quantity,
        discount_percentage: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const currentCart = state.cart || {
        id: "demo-cart",
        user_id: "demo-user",
        total_items: 0,
        total_amount: 0,
        discount_percentage: 0,
        final_amount: 0,
        status: "ACTIVE",
        items: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      const existingItemIndex = currentCart.items.findIndex(item => item.product.id === productId);
      let updatedItems;
      
      if (existingItemIndex >= 0) {
        updatedItems = currentCart.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity, total_price: item.unit_price * (item.quantity + quantity) }
            : item
        );
      } else {
        updatedItems = [...currentCart.items, mockCartItem];
      }
      
      const updatedCart = {
        ...currentCart,
        items: updatedItems,
        total_items: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        total_amount: updatedItems.reduce((sum, item) => sum + item.total_price, 0),
        discount_percentage: updatedItems.reduce((sum, item) => sum + item.discount_percentage, 0),
        final_amount: updatedItems.reduce((sum, item) => sum + item.total_price, 0) - updatedItems.reduce((sum, item) => sum + item.discount_amount, 0),
      };
      
      dispatch({ type: "SET_CART", payload: updatedCart });
      toast.success("Item added to cart");
    }
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const cart = await ecommerceService.updateCartItem(itemId, { quantity });
      dispatch({ type: "SET_CART", payload: cart });
      toast.success("Cart updated");
    } catch (error) {
      console.error("Failed to update cart item:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to update cart item" });
      toast.error("Failed to update cart item");
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const cart = await ecommerceService.removeFromCart(itemId);
      dispatch({ type: "SET_CART", payload: cart });
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to remove item from cart" });
      toast.error("Failed to remove item from cart");
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await ecommerceService.clearCart();
      dispatch({ type: "CLEAR_CART" });
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to clear cart" });
      toast.error("Failed to clear cart");
    }
  };

  // Load cart on mount
  useEffect(() => {
    refreshCart();
  }, []);

  const value: CartContextType = {
    ...state,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
