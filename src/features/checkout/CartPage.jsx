import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft, TriangleAlert } from "lucide-react";
import { useStore } from "../../store/store";

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
  const { product, quantity, price } = item;
  const subtotal = price * quantity;

  // Note: we're using the base tier price to check if discount applies.
  // We can just keep it simple. The price in the cart is already the discounted tier price
  // from when they clicked Add, but if they change qty we should recompute.
  // Actually, we'll just display the current price.

  return (
    <div className="grid grid-cols-1 gap-4 border-b border-[#C1C8C1] p-6 last:border-b-0 sm:grid-cols-12 sm:items-start">
      <div className="sm:col-span-4">
        <p className="text-base font-semibold text-[#1B1C1A]">{product.name}</p>
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
  const { cart, updateQuantity, removeFromCart } = useStore();
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const navigate = useNavigate();

  const increment = (id, currentQty) => updateQuantity(id, currentQty + 1);
  const decrement = (id, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  };

  const removeItem = (id) => removeFromCart(id);

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
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        </div>
      )}
    </main>
  );
}
