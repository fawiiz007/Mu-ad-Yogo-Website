// ============================================================================
// MUAD YOGO — BUSINESS / CONTACT CONFIG
// ============================================================================
// Central place for business info referenced across the site (footer, contact
// page, WhatsApp CTA). Values from supplied brand material are marked
// unverified until confirmed by the business — see SRS §25 and §33.
// ============================================================================

export const business = {
  name: "Muad Yogo",
  tagline: "Fresh. Creamy. Delicious.",

  // ✅ Confirmed with business — corrected format (no leading 0 after +234)
  whatsappNumber: "+2347032744585",
  whatsappNumberVerified: true,

  instagramHandle: "Muad.yogo",
  instagramVerified: false,

  tiktokHandle: "Muad.yogo",
  tiktokVerified: false,

  // Not yet supplied — leave blank until confirmed, do not invent
  location: "", // TBC
  deliveryAreas: "", // TBC
  operatingHours: "", // TBC
  deliveryFee: null as number | null, // TBC
  pickupAvailable: null as boolean | null, // TBC
  minimumOrder: null as number | null, // TBC
} as const;

/**
 * Builds a wa.me link. Assumes whatsappNumber needs to be converted to
 * international format (e.g. "07032744585" -> "2347032744585") before use —
 * confirm the correct country code with the business.
 */
export function buildWhatsAppLink(message: string, internationalNumber: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${internationalNumber}?text=${encoded}`;
}
