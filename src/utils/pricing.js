/**
 * The buyer-side mirror of the server's pricing rules
 * (pws-backend/src/config/pricing.js and orderController's tier helpers).
 *
 * The server stays the authority — nothing here is ever sent back as a price to
 * charge. This exists so the cart can answer "what does this cost now?" on the
 * same tick the buyer presses +, instead of blinking stale numbers until the
 * quote returns. Because both sides run the same rules, that optimistic answer
 * matches the quote when it lands and the totals never jump.
 */

// Nepal's flat 13% VAT, charged on the value after any bulk discount. Pickup
// only, so there is no delivery charge to add on top.
export const VAT_RATE = 0.13;

/** The bulk tiers this buyer can actually reach, cheapest quantity first. */
export const tiersFor = (product, role) => {
  if (role !== "verified_wholesale") return [];
  return [...(product?.tierPrices || [])]
    .filter(
      (tier) =>
        Number(tier.minQuantity) > 1 &&
        Number(tier.price) > 0 &&
        Number(tier.price) < product.retailPrice,
    )
    .map((tier) => ({
      minQuantity: Number(tier.minQuantity),
      price: Number(tier.price),
    }))
    .sort((a, b) => a.minQuantity - b.minQuantity);
};

/** The unit price at this exact quantity — the tier the buyer has reached. */
export const unitPriceFor = (product, quantity, role) => {
  const tier = [...tiersFor(product, role)]
    .reverse()
    .find((item) => quantity >= item.minQuantity);
  return tier?.price ?? product?.retailPrice ?? 0;
};

/**
 * Everything the cart row needs for one line, derived from the quantity that is
 * on screen right now: price, discount, and how far along the bulk threshold
 * the buyer is.
 */
export const lineFor = (item, role) => {
  const product = item?.product || {};
  const quantity = item?.quantity || 0;
  const tiers = tiersFor(product, role);

  const retailPrice = Number(product.retailPrice ?? item?.price ?? 0);
  const unitPrice = tiers.length
    ? unitPriceFor(product, quantity, role)
    : Number(item?.price ?? retailPrice);

  const subtotal = retailPrice * quantity;
  const discount = Math.max(0, subtotal - unitPrice * quantity);

  const threshold = tiers[0]?.minQuantity ?? null;
  const topThreshold = tiers[tiers.length - 1]?.minQuantity ?? null;
  const unlocked = threshold != null && quantity >= threshold;
  const nextTier = tiers.find((tier) => quantity < tier.minQuantity) ?? null;

  return {
    productId: String(product._id || item?.id || ""),
    name: product.name || item?.name || "Product",
    unit: product.unit || item?.unit || "unit",
    quantity,
    retailPrice,
    unitPrice,
    subtotal,
    discount,
    final: Math.max(0, subtotal - discount),
    tiers,
    threshold,
    unlocked,
    nextTier,
    // The three Figma milestone blocks: none until the first tier is reached,
    // then filling towards the deepest tier the product offers.
    segments: segmentsFor({ quantity, threshold, topThreshold, unlocked }),
  };
};

const segmentsFor = ({ quantity, threshold, topThreshold, unlocked }) => {
  if (!unlocked) return 0;
  if (topThreshold == null || topThreshold === threshold) return 3;
  if (quantity >= topThreshold) return 3;
  const progress = (quantity - threshold) / (topThreshold - threshold);
  return Math.min(3, 1 + Math.floor(progress * 2));
};

/** Subtotal, discount and Nepal VAT rolled up from a set of lines. */
export const totalsFor = (lines) => {
  const subtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
  const discount = lines.reduce((sum, line) => sum + line.discount, 0);
  return settleTotals({ subtotal, discount });
};

export const settleTotals = ({ subtotal = 0, discount = 0 } = {}) => {
  const net = Math.max(0, subtotal - discount);
  const tax = Math.round(net * VAT_RATE);
  return { subtotal, discount, net, tax, total: net + tax };
};
