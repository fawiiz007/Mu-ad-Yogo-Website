"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "../../context/CartContext";
import OrderSummary from "../OrderSummary/OrderSummary";
import "./CartModal.css";

export default function CartModal() {
  const [open, setOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const { totalQuantity } = useCart();
  const prevQuantity = useRef(totalQuantity);

  // Lock background scroll and listen for Escape key while modal is open
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // Trigger a brief bounce on the floating button whenever an item is added
  useEffect(() => {
    if (totalQuantity > prevQuantity.current) {
      setJustAdded(true);
      const timeout = setTimeout(() => setJustAdded(false), 500);
      prevQuantity.current = totalQuantity;
      return () => clearTimeout(timeout);
    }
    prevQuantity.current = totalQuantity;
  }, [totalQuantity]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open your order"
        className={`cart-fab${justAdded ? " cart-fab--bump" : ""}`}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {totalQuantity > 0 && (
          <span className="cart-fab-badge">{totalQuantity}</span>
        )}
      </button>

      {open && (
        <div
          className="cart-modal-overlay"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="cart-modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cart-modal-header">
              <h2 className="cart-modal-title">Your Order</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close order panel"
                className="cart-modal-close"
              >
                &times;
              </button>
            </div>

            <div className="cart-modal-body">
              <OrderSummary />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
