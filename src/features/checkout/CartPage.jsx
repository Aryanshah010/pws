import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  TriangleAlert,
  BookmarkPlus,
  Check,
  TrendingDown,
} from "lucide-react";
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

/**
 * US #50 — Tier progress bar.
 * Shows how many more units the buyer needs to reach the next discount tier.
 */
function TierProgressBar({ item }) {
  const tiers = item.product?.tierPrices;
  if (!tiers || tiers.length === 0) return null;

  const sorted = [...tiers].sort((a, b) => a.minQuantity - b.minQuantity);
  const currentQty = item.quantity;

  const nextTier = sorted.find((t) => t.minQuantity > currentQty);
  const activeTier = [...sorted]
    .reverse()
    .find((t) => t.minQuantity <= currentQty);

  if (!nextTier) {
    // Already at best tier
    return (
      <div className="mt-2 flex items-center gap-2 rounded-default border border-[#c6e9d2] bg-[#F4FBF4] px-3 py-2 text-[12px] font-semibold text-[#1B5E40]">
        <TrendingDown className="h-3.5 w-3.5 shrink-0" />
        Best tier unlocked — Rs.&nbsp;{activeTier?.price ?? item.price} / unit
      </div>
    );
  }

  const needed = nextTier.minQuantity - currentQty;
  const progress = Math.min((currentQty / nextTier.minQuantity) * 100, 100);
  const saving = item.product.retailPrice - nextTier.price;

  return (
    <div className="mt-2 rounded-default border border-[#c6e9d2] bg-[#F4FBF4] px-3 py-2.5 text-[12px]">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-semibold text-[#1B5E40]">
          Add&nbsp;{needed}&nbsp;more {item.product.unit || "units"} → save
          Rs.&nbsp;{saving}/unit
        </span>
        <span className="text-[#717973]">
          {currentQty}/{nextTier.minQuantity}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#C1E4CB]">
        <div
          className="h-full rounded-full bg-[#1B5E40] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/** US #22 — Save as Basket + standard order summary */
function OrderSummary({ subtotal, discount, tax, onCheckout, cart, token }) {
  const total = subtotal - discount + tax;
  const [basketName, setBasketName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [basketError, setBasketError] = useState("");
  const navigate = useNavigate();

  const handleSaveBasket = async () => {
    if (!token) return navigate("/login");
    if (!basketName.trim()) {
      setBasketError("Enter a name for this basket");
      return;
    }
    setSaving(true);
    setBasketError("");
    try {
      await apiRequest("/orders/baskets", {
        method: "POST",
        headers: authHeader(token),
        body: JSON.stringify({
          name: basketName.trim(),
          items: cart.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
          })),
        }),
      });
      setSaved(true);
      setBasketName("");
    } catch (err) {
      setBasketError(err.message || "Could not save basket");
    } finally {
      setSaving(false);
    }
  };

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

      {/* US #22 — Save as Basket */}
      <div className="flex flex-col gap-2 border-t border-[#C1C8C1] pt-4">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#414943]">
          <BookmarkPlus className="h-4 w-4 text-[#1B5E40]" />
          Save cart as Basket template
        </div>
        {saved ? (
          <div className="flex items-center gap-2 rounded-default border border-[#c6e9d2] bg-[#F4FBF4] px-3 py-2 text-[13px] font-semibold text-[#1B5E40]">
            <Check className="h-4 w-4" />
            Basket saved! View in{" "}
            <Link
              to="/myorder"
              className="underline hover:opacity-80"
            >
              My Orders
            </Link>
            .
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                value={basketName}
                onChange={(e) => {
                  setBasketName(e.target.value);
                  setBasketError("");
                }}
                placeholder="e.g. Weekly staples"
                className="flex-1 rounded border border-[#C1C8C1] bg-[#F4FBF4] px-3 py-2 text-[13px] outline-none focus:ring-1 focus:ring-[#1B5E40]"
              />
              <button
                type="button"
                onClick={handleSaveBasket}
                disabled={saving || cart.length === 0}
                className="rounded border border-[#1B5E40] px-3 py-2 text-[13px] font-semibold text-[#1B5E40] transition-colors hover:bg-[#1B5E40]/10 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
            {basketError && (
              <p className="text-[12px] text-red-600">{basketError}</p>
            )}
          </>
        )}
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

function CartItemRow({ item, onIncrement, onDecrement, onRemove }) {
  const { product, quantity, price } = item;
  const subtotal = price * quantity;

  return (
    <div className="grid grid-cols-1 gap-4 border-b border-[#C1C8C1] p-6 last:border-b-0 sm:grid-cols-12 sm:items-start">
      <div className="sm:col-span-4">
        <p className="text-base font-semibold text-[#1B1C1A]">{product.name}</p>
        {/* US #50 — per-item tier progress bar */}
        <TierProgressBar item={item} />
      </div>

      <div className="flex flex-col items-center gap-1.75 sm:col-span-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Decrease ${product.name} quantity`}
            onClick={() => onDecrement(product._id, quantity)}
            className="flex h-8 w-8 items-center justify-center rounded border border-[#C1C8C1] bg-[#fbf9f5] transition-colors hover:bg-[#efeeea]"
          >
            <Minus className="h-[11px] w-[11px] text-[#1B1C1A]" />
          </button>
          <div className="flex items-center gap-1 rounded border border-[#C1C8C1] bg-white px-3 py-1">
            <span className="text-base text-[#1B1C1A]">{quantity}</span>
            <span className="text-base text-[#404943]">({product.unit})</span>
          </div>
          <button
            type="button"
            aria-label={`Increase ${product.name} quantity`}
            onClick={() => onIncrement(product._id, quantity)}
            className="flex h-8 w-8 items-center justify-center rounded border border-[#C1C8C1] bg-[#fbf9f5] transition-colors hover:bg-[#efeeea]"
          >
            <Plus className="h-[11px] w-[11px] text-[#1B1C1A]" />
          </button>
        </div>

        <div className="flex w-full max-w-[200px] flex-col items-center gap-1">
          <p className="text-[13px] font-semibold text-[#404943]">
            Unit Price: Rs. {price}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start gap-1 pt-2 sm:col-span-3">
        <p className="text-base font-semibold text-[#1B1C1A]">
          Subtotal: Rs. {subtotal}
        </p>
      </div>

      <div className="flex justify-end sm:col-span-1 sm:justify-center sm:pt-2">
        <button
          type="button"
          aria-label={`Remove ${product.name} from cart`}
          onClick={() => onRemove(product._id)}
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
  const { cart, token, updateQuantity, removeFromCart, synchronizeCartPrices } =
    useStore();
  const [quote, setQuote] = useState(null);
  const navigate = useNavigate();

  const increment = (id, currentQty) => updateQuantity(id, currentQty + 1);
  const decrement = (id, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  };

  const removeItem = (id) => removeFromCart(id);

  useEffect(() => {
    if (!token || !cart.length) return setQuote(null);
    apiRequest("/orders/quote", {
      method: "POST",
      headers: authHeader(token),
      body: JSON.stringify({
        items: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
      }),
    })
      .then(setQuote)
      .catch(() => setQuote(null));
  }, [cart, token]);

  const totals = useMemo(() => {
    return cart.reduce(
      (acc, item) => {
        const subtotal = item.price * item.quantity;
        return {
          subtotal: acc.subtotal + subtotal,
          discount: 0,
        };
      },
      { subtotal: 0, discount: 0 },
    );
  }, [cart]);

  const priceChanges =
    quote?.items?.filter((quoted) => {
      const cartItem = cart.find(
        (item) => String(item.product._id) === String(quoted.productId),
      );
      return cartItem && cartItem.price !== quoted.unitPrice;
    }) || [];
  const displayTotals = quote
    ? {
        subtotal: quote.subtotalAmount,
        discount: quote.discountAmount,
        total: quote.totalAmount,
      }
    : {
        subtotal: totals.subtotal,
        discount: totals.discount,
        total: totals.subtotal - totals.discount,
      };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
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
                  String(cartItem.product._id) === String(change.productId),
              );
              return (
                <PriceChangeAlert
                  key={change.productId}
                  message={`${item.product.name} changed from Rs. ${item.price} to Rs. ${change.unitPrice}.`}
                  onRemove={() => removeItem(item.product._id)}
                  onKeep={() => synchronizeCartPrices(quote.items)}
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

            {cart.map((item) => (
              <CartItemRow
                key={item.product._id}
                item={item}
                onIncrement={increment}
                onDecrement={decrement}
                onRemove={removeItem}
              />
            ))}

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
              cart={cart}
              token={token}
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        </div>
      )}
    </main>
  );
}
