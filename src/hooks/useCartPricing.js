import { useEffect, useMemo, useState } from "react";
import { useStore } from "../store/store";
import { apiRequest, authHeader } from "../services/api";
import { lineFor, totalsFor, unitPriceFor } from "../utils/pricing";

export default function useCartPricing() {
  const cart = useStore((state) => state.cart);
  const token = useStore((state) => state.token);
  const role = useStore((state) => state.user?.role);
  const [quote, setQuote] = useState(null);
  const signature = useMemo(
    () => cart.map((item) => `${item.product?._id}:${item.quantity}`).join("|"),
    [cart],
  );

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
        // Once the server quote covers this exact line, trust it for the
        // discount progress too, so the bar can never disagree with the amount.
        tiers: match.tiers ?? line.tiers,
        threshold: match.threshold !== undefined ? match.threshold : line.threshold,
        unlocked: match.unlocked !== undefined ? match.unlocked : line.unlocked,
        nextTier: match.nextTier !== undefined ? match.nextTier : line.nextTier,
        segments: match.segments !== undefined ? match.segments : line.segments,
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

    const priceChanges = isCurrent
      ? cart
          .map((item) => {
            const match = quoted.get(String(item.product?._id));
            const was = item.basePrice ?? unitPriceFor(item.product, role);
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

    return {
      lines,
      totals,
      quote,
      quoteItems: quote?.items || [],
      priceChanges,
    };
  }, [cart, localLines, quote, role]);
}
