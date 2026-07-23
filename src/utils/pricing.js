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

/**
 * The discount table, cleaned into brackets that actually make sense.
 *
 * Each bracket is a quantity range with a flat rupee discount: 10–49 takes
 * Rs. 50 off the line, once, however many units are in it. Brackets are sorted,
 * and any that overlaps its predecessor or fails to beat it is dropped, so a
 * table saved before these rules existed can never promise a buyer a discount
 * that shrinks as they add more.
 */
export const normaliseTiers = (tiers) => {
  let previousMax = 1;
  let previousDiscount = 0;
  return [...(tiers || [])]
    .map((tier) => ({
      minQuantity: Number(tier.minQuantity),
      maxQuantity:
        tier.maxQuantity == null || tier.maxQuantity === ""
          ? null
          : Number(tier.maxQuantity),
      discountAmount: Number(tier.discountAmount),
    }))
    .filter(
      (tier) =>
        Number.isFinite(tier.minQuantity) &&
        tier.minQuantity > 1 &&
        Number.isFinite(tier.discountAmount) &&
        tier.discountAmount > 0 &&
        (tier.maxQuantity == null || tier.maxQuantity >= tier.minQuantity),
    )
    .sort((a, b) => a.minQuantity - b.minQuantity)
    .filter((tier) => {
      if (tier.minQuantity <= previousMax) return false;
      if (tier.discountAmount <= previousDiscount) return false;
      previousMax = tier.maxQuantity ?? Infinity;
      previousDiscount = tier.discountAmount;
      return true;
    });
};

/** The discount brackets this buyer can reach, lowest quantity first. */
export const tiersFor = (product, role) => {
  // A product taken off discount has no ladder at all, for anyone.
  if (product?.discountable === false) return [];
  const table =
    role === "verified_wholesale" && product?.wholesaleDiscountTiers?.length
      ? product.wholesaleDiscountTiers
      : product?.discountTiers;
  return normaliseTiers(table);
};

/** The bracket a quantity falls into, or null when it earns no discount yet. */
export const tierAt = (tiers, quantity) =>
  tiers.find(
    (tier) =>
      quantity >= tier.minQuantity &&
      (tier.maxQuantity == null || quantity <= tier.maxQuantity),
  ) ?? null;

/** The next bracket up, for "add N more to reach it". */
export const nextTierAfter = (tiers, quantity) =>
  tiers.find((tier) => quantity < tier.minQuantity) ?? null;

/**
 * The flat discount on one line. Capped at the line's own value so a generous
 * bracket can never hand back more than the goods are worth.
 */
export const lineDiscount = (tiers, quantity, retailPrice) => {
  const tier = tierAt(tiers, quantity);
  if (!tier) return 0;
  return Math.min(tier.discountAmount, retailPrice * quantity);
};

/** The unit price never moves with quantity — bulk earns a flat amount off. */
export const unitPriceFor = (product) => Number(product?.retailPrice) || 0;

/**
 * Everything the cart row needs for one line, derived from the quantity that is
 * on screen right now: price, discount, and how far along the discount table
 * the buyer is.
 */
export const lineFor = (item, role) => {
  const product = item?.product || {};
  const quantity = item?.quantity || 0;
  const tiers = tiersFor(product, role);

  const unitPrice = Number(product.retailPrice ?? item?.price ?? 0);
  const subtotal = unitPrice * quantity;
  const discount = lineDiscount(tiers, quantity, unitPrice);

  const activeTier = tierAt(tiers, quantity);
  const nextTier = nextTierAfter(tiers, quantity);
  const threshold = tiers[0]?.minQuantity ?? null;

  return {
    productId: String(product._id || item?.id || ""),
    name: product.name || item?.name || "Product",
    unit: product.unit || item?.unit || "unit",
    quantity,
    retailPrice: unitPrice,
    unitPrice,
    subtotal,
    discount,
    final: Math.max(0, subtotal - discount),
    tiers,
    threshold,
    unlocked: Boolean(activeTier),
    nextTier,
    // The three Figma milestone blocks: none until the first bracket is
    // reached, then one per bracket climbed.
    segments: segmentsFor(tiers, activeTier),
  };
};

const segmentsFor = (tiers, activeTier) => {
  if (!activeTier || !tiers.length) return 0;
  const reached = tiers.indexOf(activeTier) + 1;
  // Always fill the last block on the top bracket, however few brackets exist.
  if (reached === tiers.length) return 3;
  return Math.max(1, Math.round((reached / tiers.length) * 3) || 1);
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
