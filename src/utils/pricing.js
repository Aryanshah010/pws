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

export const tiersFor = (product, role) => {
  if (product?.discountable === false) return [];
  const table =
    role === "verified_wholesale" && product?.wholesaleDiscountTiers?.length
      ? product.wholesaleDiscountTiers
      : product?.discountTiers;
  return normaliseTiers(table);
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

export const unitPriceFor = (product) => Number(product?.retailPrice) || 0;

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
