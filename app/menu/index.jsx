"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import straberry_yogurt from "../../app/strawberry_yogurt.png";
import vanilla_yogurt from "../../app/vanilla.png";
import sweetened_yogurt from "../../app/sweetened.png";
import parfait from "../../app/parfait.png";
import plain_yogurt from "../../app/plain yogurt.png";
import parfait_ice_cream from "../../app/parfait ice cream.png";
import parfait_ice_cream_with_fruits from "../../app/parfait icecream with fruits.png";
import { useCart } from "../context/CartContext";
import "./MenuPage.css";

// ============================================================================
// All pricing/flavour data below is confirmed with the business.
// Per-flavour photography is still placeholder (reusing item_one–four) —
// swap in real photos as they become available.
// ============================================================================

const products = [
  {
    id: "yogurt",
    name: "YOGURT",
    image: plain_yogurt,
    fields: [
      {
        type: "select",
        label: "Select Flavour",
        affectsImage: true,
        options: [
          { label: "Vanilla", image: vanilla_yogurt },
          { label: "Strawberry", image: straberry_yogurt },
          { label: "Greek", image: plain_yogurt },
          { label: "Sweetened", image: sweetened_yogurt },
        ],
      },
      {
        type: "select",
        label: "Select Size",
        options: [
          { label: "25cl", priceNGN: 2000 },
          { label: "35cl", priceNGN: 2500 },
          { label: "50cl", priceNGN: 4000 },
        ],
      },
    ],
  },
  {
    id: "parfait-ice-cream",
    name: "PARFAIT ICE CREAM",
    image: parfait_ice_cream,
    fields: [
      {
        type: "select",
        label: "Style",
        affectsImage: true,
        // Price depends on BOTH style and size — each style carries its own
        // size/price list, applied dynamically below.
        options: [
          {
            label: "Without Fruits",
            image: parfait_ice_cream,
            sizes: [
              { label: "330ml", priceNGN: 3000 },
              { label: "500ml", priceNGN: 5000 },
            ],
          },
          {
            label: "With Fruits",
            image: parfait_ice_cream_with_fruits,
            sizes: [
              { label: "330ml", priceNGN: 4500 },
              { label: "500ml", priceNGN: 6500 },
            ],
          },
        ],
      },
      {
        type: "select",
        label: "Select Size",
        // Options are computed at runtime from the selected Style — see
        // `effectiveSizeOptions` in ProductCard. Left empty here on purpose.
        options: [],
        dependsOnStyle: true,
      },
    ],
  },
  {
    id: "parfait",
    name: "PARFAIT",
    image: parfait,
    fields: [
      {
        type: "multi-select",
        label: "Select Fruits",
        options: [
          "Strawberry",
          "Banana",
          "Grapes",
          "Kiwi",
          "Granola",
          "Blackberries",
        ],
      },
      {
        type: "select",
        label: "Select Size",
        options: [
          { label: "330ml", priceNGN: 4500 },
          { label: "500ml", priceNGN: 7000 },
          { label: "1 litre", priceNGN: 14500 },
        ],
      },
    ],
  },
  {
    id: "chocolate-pop-ice",
    name: "CHOCOLATE POP ICE",
    // Confirmed with business: to be added later — not on the active menu yet
    status: "coming-soon",
    image: plain_yogurt,
    fields: [
      {
        type: "select",
        label: "Select Flavour",
        options: [
          { label: "Dark Chocolate" },
          { label: "Milk Chocolate" },
          { label: "White Chocolate" },
        ],
      },
      {
        type: "select",
        label: "Select Size",
        options: [{ label: "2 pcs" }, { label: "4 pcs" }, { label: "6 pcs" }],
      },
    ],
  },
];

function ProductCard({ product }) {
  const { addItem } = useCart();
  const isComingSoon = product.status === "coming-soon";

  const imageField = product.fields.find(
    (f) => f.type === "select" && f.affectsImage,
  );
  const [activeImage, setActiveImage] = useState(
    imageField ? imageField.options[0].image : product.image,
  );

  const sizeField = product.fields.find(
    (f) => f.type === "select" && f.label.includes("Size"),
  );
  const variantField = product.fields.find(
    (f) => f.type === "select" && f !== sizeField,
  );

  const [selectedVariant, setSelectedVariant] = useState(
    variantField ? variantField.options[0].label : null,
  );

  // If the size field depends on the selected variant (e.g. Parfait Ice
  // Cream's Style), compute its options from the variant; otherwise use the
  // field's own static options.
  const effectiveSizeOptions = sizeField?.dependsOnStyle
    ? (variantField.options.find((o) => o.label === selectedVariant)?.sizes ??
      [])
    : (sizeField?.options ?? []);

  const [selectedSize, setSelectedSize] = useState(
    effectiveSizeOptions[0] ?? null,
  );

  // When a dependent variant changes, the available sizes change too —
  // reset to the first size of the new list so price never gets stale.
  useEffect(() => {
    if (sizeField?.dependsOnStyle) {
      setSelectedSize(effectiveSizeOptions[0] ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariant]);

  const [multiSelections, setMultiSelections] = useState({});
  const [quantity, setQuantity] = useState(1);

  const handleSelect = (field, rawValue) => {
    if (field === sizeField) {
      const chosen = effectiveSizeOptions.find((opt) => opt.label === rawValue);
      setSelectedSize(chosen);
    } else if (field === variantField) {
      setSelectedVariant(rawValue);
      const chosen = variantField.options.find((opt) => opt.label === rawValue);
      if (field.affectsImage && chosen?.image) setActiveImage(chosen.image);
    }
  };

  const toggleFruit = (field, fruit) => {
    setMultiSelections((prev) => {
      const current = prev[field.label] || [];
      const next = current.includes(fruit)
        ? current.filter((f) => f !== fruit)
        : [...current, fruit];
      return { ...prev, [field.label]: next };
    });
  };

  const unitPrice = selectedSize?.priceNGN ?? 0;
  const formatNaira = (n) => `₦${n.toLocaleString()}`;

  // If the product has a multi-select field (e.g. Parfait's fruit picker),
  // require at least one option chosen before an order can be placed.
  const multiSelectFields = product.fields.filter(
    (f) => f.type === "multi-select",
  );
  const allFruitSelections = multiSelectFields.flatMap(
    (f) => multiSelections[f.label] || [],
  );
  const meetsMultiSelectRequirement =
    multiSelectFields.length === 0 || allFruitSelections.length > 0;

  const canAddToOrder =
    !isComingSoon && !!selectedSize && meetsMultiSelectRequirement;

  const handleAddToOrder = () => {
    if (!canAddToOrder) return;

    const fruitSelections = product.fields
      .filter((f) => f.type === "multi-select")
      .flatMap((f) => multiSelections[f.label] || []);

    const selectionsSummary = {
      ...(variantField ? { [variantField.label]: selectedVariant } : {}),
      [sizeField.label]: selectedSize.label,
      ...(fruitSelections.length ? { "Select Fruits": fruitSelections } : {}),
    };

    const cartKey = `${product.id}::${JSON.stringify(selectionsSummary)}`;

    addItem({
      cartKey,
      productId: product.id,
      name: product.name,
      image: activeImage,
      selections: selectionsSummary,
      unitPrice,
      quantity,
    });

    setQuantity(1);
  };

  return (
    <div className="menu-card">
      <div className="menu-card-image-wrap">
        <Image
          src={activeImage}
          alt={product.name}
          className="menu-card-image"
        />
      </div>

      <div className="menu-card-body">
        <h3 className="menu-card-name">{product.name}</h3>

        <div className="menu-card-price-row">
          <p className="menu-card-price">
            {isComingSoon
              ? "Coming Soon"
              : selectedSize
                ? formatNaira(unitPrice)
                : "Select a size"}
          </p>

          {!isComingSoon && (
            <div className="menu-card-stepper">
              <button
                type="button"
                className="menu-card-stepper-btn"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="menu-card-qty">{quantity}</span>
              <button
                type="button"
                className="menu-card-stepper-btn"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>

        <div className="menu-card-fields">
          {product.fields.map((field) => {
            if (field.type === "multi-select") {
              const selected = multiSelections[field.label] || [];
              return (
                <div key={field.label} className="menu-card-field">
                  <label className="menu-card-field-label">{field.label}</label>
                  <div className="menu-card-chip-group">
                    {field.options.map((fruit) => {
                      const isSelected = selected.includes(fruit);
                      return (
                        <button
                          type="button"
                          key={fruit}
                          onClick={() => toggleFruit(field, fruit)}
                          disabled={isComingSoon}
                          className={`menu-card-chip${isSelected ? " menu-card-chip--selected" : ""}`}
                          aria-pressed={isSelected}
                        >
                          {fruit}
                        </button>
                      );
                    })}
                  </div>
                  {selected.length === 0 && (
                    <p className="mt-1 text-xs text-red-500">
                      Select at least 1 fruit
                    </p>
                  )}
                </div>
              );
            }

            // Size field on a dependent product renders from effectiveSizeOptions,
            // recomputed whenever the linked Style changes.
            const options =
              field === sizeField && field.dependsOnStyle
                ? effectiveSizeOptions
                : field.options;
            const defaultLabel = options[0]?.label;

            return (
              <div key={field.label} className="menu-card-field">
                <label className="menu-card-field-label">{field.label}</label>
                <div className="menu-card-select-wrap">
                  <select
                    className="menu-card-select"
                    value={
                      field === sizeField
                        ? (selectedSize?.label ?? "")
                        : undefined
                    }
                    defaultValue={
                      field === sizeField ? undefined : defaultLabel
                    }
                    aria-label={field.label}
                    disabled={isComingSoon}
                    onChange={(e) => handleSelect(field, e.target.value)}
                  >
                    {options.map((opt) => (
                      <option key={opt.label} value={opt.label}>
                        {opt.label}
                        {opt.priceNGN ? ` — ${formatNaira(opt.priceNGN)}` : ""}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="menu-card-chevron"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#323653"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="menu-card-btn"
          type="button"
          disabled={!canAddToOrder}
          style={
            !canAddToOrder ? { opacity: 0.5, cursor: "not-allowed" } : undefined
          }
          onClick={handleAddToOrder}
        >
          {isComingSoon ? "COMING SOON" : "ADD TO ORDER"}
        </button>
      </div>
    </div>
  );
}

export default function MenuPage() {
  return (
    <section id="menu" className="menu-section">
      <div className="menu-header">
        <h2 className="menu-title">Our Signature Collection</h2>
        <p className="menu-subtitle">
          Crafted with the finest ingredients for an unforgettable taste
          experience.
        </p>
      </div>

      <div className="menu-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
