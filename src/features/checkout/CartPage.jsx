import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft, TriangleAlert } from "lucide-react";
import { toast } from "react-toastify";
import { useStore } from "../../store/store";
import { apiRequest, authHeader } from "../../services/api";

// --- COMPONENTS ---

function PriceChangeAlert({ message, onRemove, onKeep }) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-default border border-[#FFB86B] bg-[#FFDCBC] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <TriangleAlert className="h-[19px] w-[19px] shrink-0 text-[#D4820A]" />
        <p className="text-[13px] font-semibold leading-[120%] text-[#D4820A]">
          {message}
        </p>
      </div>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onRemove}
          className="rounded-default border border-[#6B3F00] px-4 py-2 text-[13px] font-semibold text-[#6B3F00] transition-colors hover:bg-[#6B3F00]/10"
        >
          Remove
        </button>
        <button
          type="button"
          onClick={onKeep}
          className="rounded-default bg-[#6B3F00] px-4 py-2 text-[13px] font-semibold text-[#FFA535] transition-colors hover:bg-[#6B3F00]/90"
        >
          Keep
        </button>
      </div>
    </div>
  );
}

function OrderSummary({ subtotal, discount, tax, onCheckout }) {
  const total = subtotal - discount + tax;

  return (
    <div className="flex flex-col gap-6 rounded-md border border-[#C1C8C1] bg-white p-6 shadow-[0_1px_3px_1px_rgba(27,28,26,0.06)]">
      <h2 className="text-[22px] font-bold leading-[130%] text-[#1B1C1A]">
        Order Summary
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <span className="text-base text-[#1B1C1A]">Subtotal:</span>
          <span className="text-base text-[#1B1C1A]">Rs. {subtotal}</span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-base text-[#1B1C1A]">Total Discount:</span>
          <span className="text-base text-[#1B1C1A]">Rs. {discount}</span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-base text-[#1B1C1A]">Tax/fee:</span>
          <span className="text-base text-[#1B1C1A]">Rs. {tax}</span>
        </div>
      </div>

      <div className="rounded-default border border-[#C1C8C1] bg-surface-categories p-2">
        <p className="text-center text-[13px] leading-[140%] text-[#1B1C1A]">
          Pickup only. No delivery address needed!
        </p>
      </div>

      <div className="flex items-start justify-between border-t border-[#C1C8C1] pt-4">
        <span className="text-base font-semibold text-[#1B1C1A]">Total:</span>
        <span className="text-base font-semibold text-[#1B1C1A]">
          Rs. {total}
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        className="w-full rounded-[10px] bg-[#1B5E40] py-4.25 text-center text-lg font-semibold text-white transition-colors hover:bg-[#00452b]"
      >
        Proceed to checkout
      </button>
    </div>
  );
}

function CartItemRow({ item, quotedItem, onIncrement, onDecrement, onRemove }) {
  const product = item.product || {};
  const productId = product._id || item.id;
  const productName = product.name || item.name;
  const unit = product.unit || item.unit || "unit";
  const quantity = item.quantity;

  // Admin Tier Discount calculations
  const tierPrices = product.tierPrices || [];
  const sortedTiers = [...tierPrices].sort(
    (a, b) => a.minQuantity - b.minQuantity,
  );

  const discountThreshold =
    sortedTiers[0]?.minQuantity ?? item.discountThreshold ?? 10;
  const unlocked = quantity >= discountThreshold;
  const remaining = discountThreshold - quantity;

  const activeTier = [...sortedTiers]
    .reverse()
    .find((t) => t.minQuantity <= quantity);
  const nextTier = sortedTiers.find((t) => t.minQuantity > quantity);

  // 3-Segment progress calculation:
  // 1-9 qty -> 0 segments (No discount)
  // 10+ qty -> 1 to 3 segments depending on progress towards highest tier threshold
  let segments = 0;
  if (unlocked) {
    if (sortedTiers.length > 1) {
      const highestThreshold = sortedTiers[sortedTiers.length - 1].minQuantity;
      if (quantity >= highestThreshold) {
        segments = 3;
      } else {
        const progressRatio =
          (quantity - discountThreshold) /
          (highestThreshold - discountThreshold);
        segments = 1 + Math.floor(progressRatio * 2);
      }
    } else {
      segments = 3;
    }
  }

  // Price & Subtotal calculations
  const pricePerUnit =
    item.price ?? product.retailPrice ?? item.pricePerUnit ?? 0;
  const subtotal = pricePerUnit * quantity;

  let discount = 0;
  if (quotedItem && typeof quotedItem.discount === "number") {
    discount = quotedItem.discount;
  } else if (activeTier) {
    const regularTotal = (product.retailPrice || pricePerUnit) * quantity;
    const tieredTotal = activeTier.price * quantity;
    discount = Math.max(0, regularTotal - tieredTotal);
  } else if (unlocked && item.discountAmount) {
    discount = item.discountAmount;
  }

  const final = Math.max(0, subtotal - discount);

  return (
    <div className="grid grid-cols-1 gap-4 border-b border-[#C1C8C1] p-6 last:border-b-0 sm:grid-cols-12 sm:items-start">
      <div className="sm:col-span-4">
        <p className="text-base font-semibold text-[#1B1C1A]">{productName}</p>
      </div>

      <div className="flex flex-col items-center gap-1.75 sm:col-span-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Decrease ${productName} quantity`}
            onClick={() => onDecrement(productId, quantity)}
            className="flex h-8 w-8 items-center justify-center rounded border border-[#C1C8C1] bg-[#fbf9f5] transition-colors hover:bg-[#efeeea]"
          >
            <Minus className="h-[11px] w-[11px] text-[#1B1C1A]" />
          </button>
          <div className="flex items-center gap-1 rounded border border-[#C1C8C1] bg-white px-3 py-1">
            <span className="text-base text-[#1B1C1A]">{quantity}</span>
            <span className="text-base text-[#404943]">({unit})</span>
          </div>
          <button
            type="button"
            aria-label={`Increase ${productName} quantity`}
            onClick={() => onIncrement(productId, quantity)}
            className="flex h-8 w-8 items-center justify-center rounded border border-[#C1C8C1] bg-[#fbf9f5] transition-colors hover:bg-[#efeeea]"
          >
            <Plus className="h-[11px] w-[11px] text-[#1B1C1A]" />
          </button>
        </div>

        <div className="flex w-full max-w-[200px] flex-col items-center gap-1">
          <p className="text-[13px] font-semibold text-[#404943]">
            {unlocked ? "Discount unlocked!" : "No discount yet"}
          </p>
          {/* Progress Milestone Indicators */}
          <div className="flex h-3 w-full items-start justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={
                  "h-full flex-1 rounded-sm " +
                  (i < segments ? "bg-[#00452b]" : "bg-[#e4e2df]")
                }
              />
            ))}
          </div>
          {!unlocked ? (
            <p className="text-center text-[13px] leading-[140%] text-[#404943]">
              Add {remaining} more {unit}
              {remaining > 1 ? "s" : ""} to unlock discount
            </p>
          ) : nextTier ? (
            <p className="text-center text-[13px] leading-[140%] text-[#404943]">
              Add {nextTier.minQuantity - quantity} more {unit}
              {nextTier.minQuantity - quantity > 1 ? "s" : ""} for best rate
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col items-start gap-1 pt-2 sm:col-span-3">
        <p className="text-base text-[#1B1C1A]">Subtotal: Rs. {subtotal}</p>
        <p className="text-base text-[#1B1C1A]">Discount: Rs. {discount}</p>
        <p className="text-base font-semibold text-[#1B1C1A]">
          Final: Rs. {final}
        </p>
      </div>

      <div className="flex justify-end sm:col-span-1 sm:justify-center sm:pt-2">
        <button
          type="button"
          aria-label={`Remove ${productName} from cart`}
          onClick={() => onRemove(productId)}
          className="flex h-8 w-8 items-center justify-center transition-opacity hover:opacity-70"
        >
          <Trash2 className="h-6 w-6 text-[#ba1a1a]" />
        </button>
      </div>
    </div>
  );
}

// --- MAIN CONTAINER ---
export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart = [],
    token,
    updateQuantity,
    removeFromCart,
    synchronizeCartPrices,
  } = useStore();
  const [quote, setQuote] = useState(null);

  const increment = (id, currentQty) => updateQuantity(id, currentQty + 1);
  const decrement = (id, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  };

  const removeItem = (id, name) => {
    removeFromCart(id);
    toast.info(`${name || "Item"} removed from cart`);
  };

  // Realtime quote sync with backend
  useEffect(() => {
    if (!token || !cart.length) {
      setQuote(null);
      return;
    }
    apiRequest("/orders/quote", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify({
        items: cart.map((item) => ({
          product: item.product?._id || item.id,
          quantity: item.quantity,
        })),
      }),
    })
      .then(setQuote)
      .catch(() => setQuote(null));
  }, [cart, token]);

  const localTotals = useMemo(() => {
    return cart.reduce(
      (acc, item) => {
        const price =
          item.price ?? item.product?.retailPrice ?? item.pricePerUnit ?? 0;
        const subtotal = price * item.quantity;

        const tiers = item.product?.tierPrices || [];
        const sortedTiers = [...tiers].sort(
          (a, b) => a.minQuantity - b.minQuantity,
        );
        const activeTier = [...sortedTiers]
          .reverse()
          .find((t) => t.minQuantity <= item.quantity);

        let discount = 0;
        if (activeTier) {
          const regularTotal =
            (item.product?.retailPrice || price) * item.quantity;
          const tieredTotal = activeTier.price * item.quantity;
          discount = Math.max(0, regularTotal - tieredTotal);
        } else if (item.quantity >= (item.discountThreshold || 10)) {
          discount = item.discountAmount || 0;
        }

        return {
          subtotal: acc.subtotal + subtotal,
          discount: acc.discount + discount,
        };
      },
      { subtotal: 0, discount: 0 },
    );
  }, [cart]);

  const displayTotals = quote
    ? {
        subtotal: quote.subtotalAmount,
        discount: quote.discountAmount,
        total: quote.totalAmount,
      }
    : {
        subtotal: localTotals.subtotal,
        discount: localTotals.discount,
        total: localTotals.subtotal - localTotals.discount,
      };

  // Detecting price increases in real-time
  const priceChanges =
    quote?.items?.filter((quoted) => {
      const cartItem = cart.find(
        (item) =>
          String(item.product?._id || item.id) === String(quoted.productId),
      );
      return cartItem && cartItem.price !== quoted.unitPrice;
    }) || [];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Arrow links directly to Homepage */}
      <Link
        to="/"
        aria-label="Go back"
        className="flex h-6 w-6 items-center justify-center text-[#1B1C1A] transition-opacity hover:opacity-70"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      {!cart || cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-[#C1C8C1] bg-white py-24 text-center">
          <p className="text-lg font-semibold text-[#1B1C1A]">
            Your cart is empty
          </p>
          <p className="text-on-surface-variant">
            Add some items to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Cart Items Card */}
          <div className="overflow-hidden rounded-md border border-[#C1C8C1] bg-white shadow-[0_1px_3px_1px_rgba(27,28,26,0.06)] lg:col-span-8">
            {priceChanges.map((change) => {
              const item = cart.find(
                (cartItem) =>
                  String(cartItem.product?._id || cartItem.id) ===
                  String(change.productId),
              );
              const name = item?.product?.name || item?.name || "Product";
              const oldPrice = item?.price ?? item?.pricePerUnit ?? 0;
              return (
                <PriceChangeAlert
                  key={change.productId}
                  message={`Price changed: ${name} was Rs.${oldPrice}, now Rs.${change.unitPrice}.`}
                  onRemove={() => {
                    removeItem(item?.product?._id || item?.id, name);
                  }}
                  onKeep={() => {
                    synchronizeCartPrices(quote.items);
                    toast.success("Cart updated to today's prices");
                  }}
                />
              );
            })}

            <div className="hidden grid-cols-12 border-b border-[#C1C8C1] bg-[#fbf9f5] p-4 sm:grid">
              <span className="col-span-4 text-base font-semibold text-[#1B1C1A]">
                Item
              </span>
              <span className="col-span-4 text-center text-base font-semibold text-[#1B1C1A]">
                Quantity
              </span>
              <span className="col-span-3 text-base font-semibold text-[#1B1C1A]">
                Total
              </span>
              <span className="col-span-1 text-center text-base font-semibold text-[#1B1C1A]">
                Action
              </span>
            </div>

            {cart.map((item) => {
              const pId = item.product?._id || item.id;
              const quotedItem = quote?.items?.find(
                (q) => String(q.productId) === String(pId),
              );
              return (
                <CartItemRow
                  key={pId}
                  item={item}
                  quotedItem={quotedItem}
                  onIncrement={increment}
                  onDecrement={decrement}
                  onRemove={(id) =>
                    removeItem(id, item.product?.name || item.name)
                  }
                />
              );
            })}

            <div className="flex items-center justify-between border-t border-[#C1C8C1] p-4 mb-0">
              <span className="text-base font-semibold text-[#1B1C1A]">
                Grand Total
              </span>
              <span className="text-base font-semibold text-[#1B1C1A]">
                Rs. {displayTotals.total}
              </span>
            </div>
          </div>

          {/* Sidebar Summary Card */}
          <div className="lg:col-span-4">
            <OrderSummary
              subtotal={displayTotals.subtotal}
              discount={displayTotals.discount}
              tax={0}
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        </div>
      )}
    </main>
  );
}
