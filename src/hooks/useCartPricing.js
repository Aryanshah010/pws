import { useEffect, useMemo, useState } from "react";
import { useStore } from "../store/store";
import { apiRequest, authHeader } from "../services/api";
import { lineFor, totalsFor } from "../utils/pricing";

/**
 * The single source of truth for what the cart costs.
 *
 * The cart page and the checkout page used to each compute their own totals
 * from whatever price happened to be frozen into the cart when an item was
 * added, which is why the checkout could open on numbers that no longer matched
 * the cart. Both now read from here, so they cannot disagree.
 *
 * Two layers, in this order:
 *  1. a local calculation off the cart in the store, recomputed on the same
 *     render as the buyer's tap, so + and − move every figure instantly;
 *  2. the server quote, which replaces those figures the moment it lands and is
 *     what the order is actually placed against.
 *
 * The local layer runs the same rules as the server (see utils/pricing.js), so
 * layer 2 confirms layer 1 rather than contradicting it.
 */
export default function useCartPricing() {
  const cart = useStore((state) => state.cart);
  const token = useStore((state) => state.token);
  const role = useStore((state) => state.user?.role);
  const [quote, setQuote] = useState(null);

  // The cart array gets a new identity whenever prices are synchronised, so the
  // fetch keys off what actually changes the price — the products and their
  // quantities. Without this, syncing prices would trigger another quote, which
  // would sync again, forever.
  const signature = useMemo(
    () => cart.map((item) => `${item.product?._id}:${item.quantity}`).join("|"),
    [cart],
  );

  // Rebuilt from the signature rather than the cart so it keeps its identity
  // for as long as the quantities do, and the effect below fires once per real
  // change instead of once per render.
  const requestItems = useMemo(
    () =>
      signature
        ? signature.split("|").map((entry) => {
            const [product, quantity] = entry.split(":");
            return { product, quantity: Number(quantity) };
          })
        : [],
    [signature],
  );

  useEffect(() => {
    if (!token || requestItems.length === 0) return undefined;
    let cancelled = false;
    apiRequest("/orders/quote", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify({ items: requestItems }),
    })
      .then((data) => !cancelled && setQuote(data))
      .catch(() => !cancelled && setQuote(null));
    return () => {
      cancelled = true;
    };
  }, [requestItems, token]);

  const localLines = useMemo(
    () => cart.map((item) => lineFor(item, role)),
    [cart, role],
  );

  return useMemo(() => {
    const quoted = new Map(
      (quote?.items || []).map((item) => [String(item.productId), item]),
    );

    // A quote that is still in flight describes the previous cart. It is only
    // allowed to override the local figures once it covers exactly the lines on
    // screen, at exactly the quantities on screen — otherwise a quote fetched
    // before an item was removed would keep that item in the total.
    const isCurrent =
      quote != null &&
      cart.length > 0 &&
      quoted.size === localLines.length &&
      localLines.every((line) => {
        const match = quoted.get(line.productId);
        return match && match.quantity === line.quantity;
      });

    const lines = localLines.map((line) => {
      const match = isCurrent ? quoted.get(line.productId) : null;
      if (!match) return line;
      return {
        ...line,
        retailPrice: match.retailUnitPrice ?? line.retailPrice,
        unitPrice: match.unitPrice,
        subtotal: match.retailSubtotal,
        discount: match.discount,
        final: match.total,
        stockStatus: match.stockStatus,
      };
    });

    const totals = isCurrent
      ? {
          subtotal: quote.subtotalAmount,
          discount: quote.discountAmount,
          net: quote.netAmount,
          tax: quote.taxAmount,
          total: quote.totalAmount,
        }
      : totalsFor(localLines);

    // A tier the buyer just unlocked is not a price change. Only the
    // storekeeper moving the catalogue price counts, so compare against the
    // retail price this line was built with.
    const priceChanges = isCurrent
      ? cart
          .map((item) => {
            const match = quoted.get(String(item.product?._id));
            const was = item.basePrice ?? item.product?.retailPrice;
            if (!match || was == null || match.retailUnitPrice == null)
              return null;
            if (was === match.retailUnitPrice) return null;
            return {
              productId: String(item.product._id),
              name: item.product?.name || match.name || "Product",
              oldPrice: was,
              newPrice: match.retailUnitPrice,
            };
          })
          .filter(Boolean)
      : [];

    return { lines, totals, quote, quoteItems: quote?.items || [], priceChanges };
  }, [cart, localLines, quote]);
}
