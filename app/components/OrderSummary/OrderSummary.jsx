"use client";

import Image from "next/image";
import { useCart } from "../../context/CartContext";
import { buildOrderMessage, buildWhatsAppUrl } from "../../utils/whatsapp";

// Adjust this path if business.ts lives somewhere else in your repo.
import { business } from "../../../data/business";

import "./OrderSummary.css";

const formatNaira = (n) => `₦${n.toLocaleString()}`;

export default function OrderSummary() {
  const { items, removeItem, updateQuantity, totalQuantity, totalPrice } =
    useCart();

  const handleWhatsAppOrder = () => {
    // Defensive guard: if `business` failed to import correctly (wrong path,
    // missing file, etc.) this stops a hard crash and logs something useful
    // instead of throwing on business.whatsappNumber being undefined.
    if (!business?.whatsappNumber) {
      console.error(
        "OrderSummary: business.whatsappNumber is missing. Check the import path to data/business.ts.",
      );
      return;
    }

    const message = buildOrderMessage(items, totalPrice);
    const url = buildWhatsAppUrl(message, business.whatsappNumber);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (items.length === 0) {
    return (
      <div className="order-empty">
        <span className="order-empty-emoji">🍦</span>
        <p className="order-empty-title">Your order is empty.</p>
        <p className="order-empty-subtitle">
          Add something delicious from the menu!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="order-items">
        {items.map((line) => (
          <div key={line.cartKey} className="order-line">
            {line.image && (
              <div className="order-line-image">
                <Image
                  src={line.image}
                  alt={line.name}
                  fill
                  sizes="90px"
                  style={{ objectFit: "contain" }}
                />
              </div>
            )}

            <div className="order-line-main">
              <p className="order-line-name">{line.name}</p>

              <div className="order-line-selections">
                {Object.entries(line.selections).map(
                  ([label, value], i, arr) => (
                    <span key={label}>
                      {Array.isArray(value) ? value.join(", ") || "—" : value}
                      {i < arr.length - 1 ? " · " : ""}
                    </span>
                  ),
                )}
              </div>

              <p className="order-line-unit-price">
                {formatNaira(line.unitPrice)} each
              </p>

              <div className="order-line-controls">
                <div className="order-line-stepper">
                  <button
                    type="button"
                    className="order-line-stepper-btn"
                    onClick={() =>
                      updateQuantity(line.cartKey, line.quantity - 1)
                    }
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="order-line-qty">{line.quantity}</span>
                  <button
                    type="button"
                    className="order-line-stepper-btn"
                    onClick={() =>
                      updateQuantity(line.cartKey, line.quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="order-line-remove"
                  onClick={() => removeItem(line.cartKey)}
                >
                  Remove
                </button>
              </div>
            </div>

            <p className="order-line-total">
              {formatNaira(line.unitPrice * line.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="order-totals">
        <span className="order-totals-count">
          {totalQuantity} item{totalQuantity !== 1 ? "s" : ""}
        </span>
        <span className="order-totals-price">{formatNaira(totalPrice)}</span>
      </div>

      <button
        type="button"
        className="order-whatsapp-btn"
        onClick={handleWhatsAppOrder}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.51 2 12.04 2zm5.8 14.16c-.24.68-1.42 1.3-1.96 1.38-.5.08-1.14.11-1.84-.12-.42-.14-.97-.32-1.66-.63-2.93-1.27-4.84-4.24-4.99-4.44-.15-.2-1.2-1.6-1.2-3.05 0-1.46.76-2.17 1.03-2.47.27-.29.6-.37.8-.37.2 0 .4 0 .57.01.18.01.43-.07.67.51.25.6.85 2.07.92 2.22.07.15.12.33.02.53-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.02 1.12.99 2.06 1.3 2.36 1.45.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.35.08.13.08.75-.16 1.43z" />
        </svg>
        Order on WhatsApp
      </button>
    </div>
  );
}
