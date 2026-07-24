export const VAT_RATE = 0.13;

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

// Folds several tier tables into one ladder where, at every quantity, the buyer
// gets the best discount any table offers — so wholesale buyers keep the shared
// default table plus their own extra brackets. Mirrors config/pricing.js on the
// server, which is the authority at checkout.
export const combineTiers = (lists) => {
  const flat = [];
  (lists || []).forEach((list) =>
    normaliseTiers(list).forEach((tier) => flat.push(tier)),
  );
  if (!flat.length) return [];

  const discountAt = (quantity) =>
    flat.reduce(
      (best, tier) =>
        quantity >= tier.minQuantity &&
        (tier.maxQuantity == null || quantity <= tier.maxQuantity)
          ? Math.max(best, tier.discountAmount)
          : best,
      0,
    );

  const points = new Set();
  flat.forEach((tier) => {
    points.add(tier.minQuantity);
    if (tier.maxQuantity != null) points.add(tier.maxQuantity + 1);
  });
  const sorted = [...points].sort((a, b) => a - b);

  const brackets = [];
  sorted.forEach((start, index) => {
    const discountAmount = discountAt(start);
    if (discountAmount <= 0) return;
    const nextPoint = sorted[index + 1];
    const maxQuantity = nextPoint == null ? null : nextPoint - 1;
    const previous = brackets[brackets.length - 1];
    if (
      previous &&
      previous.discountAmount === discountAmount &&
      previous.maxQuantity === start - 1
    ) {
      previous.maxQuantity = maxQuantity;
    } else {
      brackets.push({ minQuantity: start, maxQuantity, discountAmount });
    }
  });
  return brackets;
};

export const tiersFor = (product, role) => {
  if (!product || product.discountable === false) return [];
  if (role === "verified_wholesale") {
    return combineTiers([product.discountTiers, product.wholesaleDiscountTiers]);
  }
  return normaliseTiers(product.discountTiers);
};

export const tierAt = (tiers, quantity) =>
  tiers.find(
    (tier) =>
      quantity >= tier.minQuantity &&
      (tier.maxQuantity == null || quantity <= tier.maxQuantity),
  ) ?? null;

export const nextTierAfter = (tiers, quantity) =>
  tiers.find((tier) => quantity < tier.minQuantity) ?? null;

export const lineDiscount = (tiers, quantity, retailPrice) => {
  const tier = tierAt(tiers, quantity);
  if (!tier) return 0;
  return Math.min(tier.discountAmount, retailPrice * quantity);
};

export const wholesaleBasePrice = (product) =>
  product?.wholesalePrice != null && product.wholesalePrice > 0
    ? product.wholesalePrice
    : product?.retailPrice;

// The buyer's base unit price before bulk discounts: wholesale buyers get the
// admin-set wholesale price (falling back to retail when it is not set).
export const unitPriceFor = (product, role) =>
  Number(
    role === "verified_wholesale"
      ? wholesaleBasePrice(product)
      : product?.retailPrice,
  ) || 0;

export const lineFor = (item, role) => {
  const product = item?.product || {};
  const quantity = item?.quantity || 0;
  const tiers = tiersFor(product, role);

  const unitPrice = unitPriceFor(product, role) || Number(item?.price) || 0;
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
    segments: segmentsFor(tiers, activeTier),
  };
};

const segmentsFor = (tiers, activeTier) => {
  if (!activeTier || !tiers.length) return 0;
  const reached = tiers.indexOf(activeTier) + 1;
  if (reached === tiers.length) return 3;
  return Math.max(1, Math.round((reached / tiers.length) * 3) || 1);
};

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
