// Builds the pre-filled WhatsApp order message and deep link from cart state.
// See SRS §21 for the expected message format.

function formatSelections(selections) {
  // Flattens selection values (handles both single strings and fruit arrays)
  // into one readable string, e.g. "Vanilla, 35cl" or "Strawberry, Banana, 330ml"
  return Object.values(selections)
    .map((v) => (Array.isArray(v) ? v.join(", ") : v))
    .filter(Boolean)
    .join(", ");
}

export function buildOrderMessage(items, totalPrice) {
  const lines = items.map((line) => {
    const details = formatSelections(line.selections);
    return `• ${line.quantity} × ${line.name} — ${details} — ₦${line.unitPrice.toLocaleString()} each`;
  });

  return [
    "Hello Mu'ad Yogo! I'd like to place an order:",
    "",
    ...lines,
    "",
    `Total: ₦${totalPrice.toLocaleString()}`,
    "",
    "Please confirm my order. Thank you!",
  ].join("\n");
}

export function buildWhatsAppUrl(message, phoneNumber) {
  // wa.me requires digits only — strip "+", spaces, dashes, etc.
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}
