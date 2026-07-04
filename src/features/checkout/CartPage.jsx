import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft, TriangleAlert } from "lucide-react";

// --- INITIAL DATA ---
const INITIAL_ITEMS = [
  {
    id: "mustard-oil",
    name: "Mustard Oil",
    unit: "pack",
    pricePerUnit: 1200,
    quantity: 9,
    discountThreshold: 10,
    discountAmount: 50,
  },
  {
    id: "rice-20kg",
    name: "Rice 20kg",
    unit: "bora",
    pricePerUnit: 2215,
    quantity: 10,
    discountThreshold: 10,
    discountAmount: 50,
  },
];

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

function CartItemRow({ item, onIncrement, onDecrement, onRemove }) {
  const subtotal = item.pricePerUnit * item.quantity;
  const unlocked = item.quantity >= item.discountThreshold;
  const discount = unlocked ? item.discountAmount : 0;
  const final = subtotal - discount;

  const segments = Math.min(
    3,
    Math.floor((item.quantity / item.discountThreshold) * 3),
  );
  const remaining = item.discountThreshold - item.quantity;

  return (
    <div className="grid grid-cols-1 gap-4 border-b border-[#C1C8C1] p-6 last:border-b-0 sm:grid-cols-12 sm:items-start">
      <div className="sm:col-span-4">
        <p className="text-base font-semibold text-[#1B1C1A]">{item.name}</p>
      </div>

      <div className="flex flex-col items-center gap-1.75 sm:col-span-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Decrease ${item.name} quantity`}
            onClick={() => onDecrement(item.id)}
            className="flex h-8 w-8 items-center justify-center rounded border border-[#C1C8C1] bg-[#fbf9f5] transition-colors hover:bg-[#efeeea]"
          >
            <Minus className="h-[11px] w-[11px] text-[#1B1C1A]" />
          </button>
          <div className="flex items-center gap-1 rounded border border-[#C1C8C1] bg-white px-3 py-1">
            <span className="text-base text-[#1B1C1A]">{item.quantity}</span>
            <span className="text-base text-[#404943]">({item.unit})</span>
          </div>
          <button
            type="button"
            aria-label={`Increase ${item.name} quantity`}
            onClick={() => onIncrement(item.id)}
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
          {!unlocked && (
            <p className="text-center text-[13px] leading-[140%] text-[#404943]">
              Add {remaining} more {item.unit}
              {remaining > 1 ? "s" : ""} to unlock discount
            </p>
          )}
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
          aria-label={`Remove ${item.name} from cart`}
          onClick={() => onRemove(item.id)}
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
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [showPriceAlert, setShowPriceAlert] = useState(true);

  const increment = (id) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );

  const decrement = (id) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );

  const removeItem = (id) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const totals = useMemo(() => {
    return items.reduce(
      (acc, item) => {
        const subtotal = item.pricePerUnit * item.quantity;
        const discount =
          item.quantity >= item.discountThreshold ? item.discountAmount : 0;
        return {
          subtotal: acc.subtotal + subtotal,
          discount: acc.discount + discount,
        };
      },
      { subtotal: 0, discount: 0 },
    );
  }, [items]);

  const grandTotal = totals.subtotal - totals.discount;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/"
        aria-label="Go back"
        className="flex h-6 w-6 items-center justify-center text-[#1B1C1A] transition-opacity hover:opacity-70"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      {showPriceAlert && items.some((i) => i.id === "mustard-oil") && (
        <PriceChangeAlert
          message="Price changed: Mustard Oil was Rs.150, now Rs.160."
          onRemove={() => {
            removeItem("mustard-oil");
            setShowPriceAlert(false);
          }}
          onKeep={() => setShowPriceAlert(false)}
        />
      )}

      {items.length === 0 ? (
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
            <div className="hidden grid-cols-12   border-b border-[#C1C8C1] bg-[#fbf9f5] p-4 sm:grid">
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

            {items.map((item) => (
              <CartItemRow
                key={item.id}
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
                Rs. {grandTotal}
              </span>
            </div>
          </div>

          {/* Sidebar Summary Card */}
          <div className="lg:col-span-4">
            <OrderSummary
              subtotal={totals.subtotal}
              discount={totals.discount}
              tax={0}
              onCheckout={() => {}}
            />
          </div>
        </div>
      )}
    </main>
  );
}
