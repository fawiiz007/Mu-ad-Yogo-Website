"use client";

import { createContext, useContext, useReducer } from "react";

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { item } = action;
      // Match existing line by product + identical selections, so re-adding
      // the same configuration bumps quantity instead of duplicating a row.
      const existingIndex = state.findIndex((line) => line.cartKey === item.cartKey);

      if (existingIndex > -1) {
        const next = [...state];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + item.quantity,
        };
        return next;
      }
      return [...state, item];
    }

    case "REMOVE_ITEM":
      return state.filter((line) => line.cartKey !== action.cartKey);

    case "UPDATE_QUANTITY":
      return state
        .map((line) =>
          line.cartKey === action.cartKey
            ? { ...line, quantity: Math.max(0, action.quantity) }
            : line
        )
        .filter((line) => line.quantity > 0); // auto-remove if quantity hits 0

    case "CLEAR":
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const addItem = (item) => dispatch({ type: "ADD_ITEM", item });
  const removeItem = (cartKey) => dispatch({ type: "REMOVE_ITEM", cartKey });
  const updateQuantity = (cartKey, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", cartKey, quantity });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const totalQuantity = items.reduce((sum, line) => sum + line.quantity, 0);
  const totalPrice = items.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalQuantity, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
