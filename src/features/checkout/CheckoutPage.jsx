import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  ShoppingBasket,
  Info,
  NotebookPen,
  CreditCard,
  BadgeCheck,
} from "lucide-react";
import { useStore } from "../../store/store";

const timeSlots = [
  { id: "9-11", label: "9-11 AM", disabled: true },
  { id: "11-1", label: "11-1 PM" },
  { id: "2-4", label: "2-4 PM" },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { user, token, cart, clearCart } = useStore();
  const [day, setDay] = useState("today");
  const [timeSlot, setTimeSlot] = useState("11-1");
  const [payment, setPayment] = useState("digital");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Compute totals
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const grandTotal = subtotal; // no tax/discount applied for simplicity in this view

  const handleConfirm = async () => {
    if (!cart || cart.length === 0) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5050/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
          })),
          pickupSlot: `${day} ${timeSlot}`,
          paymentMethod:
            payment === "digital" ? "Digital QR Transfer" : "Pay at Pickup",
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Checkout failed");

      clearCart();
      navigate("/payment-submitted"); // or /my-orders, but there's a PaymentProofSubmitted route probably?
      // User says checkout confirmation screen. Let's redirect to my-orders to show the order.
      navigate("/profile");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1512px] px-4 py-10 sm:px-8 lg:px-[100px] lg:py-14 2xl:px-[202px]  bg-background text-on-background">
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex h-6 w-6 items-center justify-center text-on-surface transition-opacity hover:opacity-70"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-[32px] font-bold leading-10 text-on-surface">
          Checkout
        </h1>
      </div>

      <div className="flex flex-col items-start gap-9 lg:flex-row">
        {/* Left column */}
        <div className="flex w-full flex-col items-start gap-6 lg:max-w-165">
          {/* Contact Details */}
          <section className="flex w-full flex-col items-start gap-4 rounded-md border border-outline-border bg-surface-lowest p-6 shadow-sm">
            <div className="flex w-full items-start justify-between">
              <div className="flex items-center gap-4">
                <User size={16} className="text-on-surface-variant" />
                <h2 className="text-[22px] font-bold leading-[130%] text-on-surface">
                  Contact Details
                </h2>
              </div>
              <button className="text-[13px] font-semibold text-[#3F81EA] transition-opacity hover:opacity-80">
                Edit
              </button>
            </div>
            <div className="flex flex-col items-start gap-1">
              <p className="text-base font-semibold text-on-surface">
                {user?.fullName || "Guest"}
              </p>
              <p className="text-base text-on-surface-variant">
                {user?.phone || "No Phone"}
              </p>
            </div>
          </section>

          {/* Pickup Time Slot */}
          <section className="flex w-full flex-col items-start gap-4 rounded-md border border-outline-border bg-surface-lowest p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ShoppingBasket size={20} className="text-on-surface-variant" />
              <h2 className="text-[22px] font-bold leading-[130%] text-on-surface">
                Pickup Time Slot
              </h2>
            </div>

            <div className="flex w-full flex-col items-start gap-3">
              <span className="text-[13px] font-semibold uppercase tracking-[0.65px] text-on-surface-variant">
                Select Day
              </span>
              <div className="flex items-start gap-3">
                {[
                  { id: "today", label: "Today" },
                  { id: "tomorrow", label: "Tomorrow" },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDay(d.id)}
                    className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                      day === d.id
                        ? "border-primary bg-primary text-white"
                        : "border-outline-border bg-surface-lowest text-on-surface-variant"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-col items-start gap-3 py-1">
              <span className="text-[13px] font-semibold uppercase tracking-[0.65px] text-on-surface-variant">
                Select Time
              </span>
              <div className="flex flex-wrap items-start gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    disabled={slot.disabled}
                    onClick={() => setTimeSlot(slot.id)}
                    className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                      slot.disabled
                        ? "cursor-not-allowed border-outline-border bg-surface-lowest text-on-surface-variant opacity-50"
                        : timeSlot === slot.id
                          ? "border-primary bg-primary text-white"
                          : "border-outline-border bg-surface-lowest text-on-surface-variant"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex w-full items-start gap-3 rounded-default border border-outline-border bg-surface-categories p-3">
              <Info
                size={20}
                className="mt-0.5 shrink-0 text-on-surface-variant"
              />
              <p className="text-base text-on-surface-variant">
                Pickup-only order. NO delivery address.
              </p>
            </div>
          </section>

          {/* Order Notes */}
          <section className="flex w-full flex-col items-start gap-4 rounded-md border border-outline-border bg-surface-lowest p-6 shadow-sm">
            <div className="flex items-center gap-3.5">
              <NotebookPen size={18} className="text-on-surface-variant" />
              <h2 className="text-[22px] font-bold leading-[130%] text-on-surface">
                Order Notes
              </h2>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Order notes optional"
              rows={4}
              className="w-full resize-none rounded-[10px] border border-outline-border bg-[#F4FBF4] px-4.25 py-3.75 text-base text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </section>
        </div>

        {/* Right column */}
        <div className="flex w-full flex-col items-center gap-6 lg:max-w-116">
          <div className="flex w-full flex-col overflow-hidden rounded-md border border-outline-border bg-surface-lowest shadow-sm">
            {/* Price Breakdown */}
            <div className="flex flex-col items-start gap-6 border-b border-outline-border p-6">
              <h2 className="text-[22px] font-bold leading-[130%] text-on-surface">
                Price Breakdown
              </h2>
              <div className="flex w-full flex-col items-start gap-4">
                <div className="flex w-full items-start justify-between">
                  <span className="text-base text-on-surface-variant">
                    Subtotal
                  </span>
                  <span className="text-base text-on-surface-variant">
                    Rs.{subtotal}
                  </span>
                </div>
                <div className="flex w-full items-start justify-between">
                  <span className="text-base text-on-surface-variant">
                    Tax/Fee
                  </span>
                  <span className="text-base text-on-surface-variant">
                    Rs.0
                  </span>
                </div>
              </div>
              <div className="flex w-full items-center justify-between border-t border-outline-border pt-4">
                <span className="text-[22px] font-bold text-on-surface">
                  Total Due
                </span>
                <span className="text-2xl font-semibold text-on-surface">
                  Rs.{grandTotal}
                </span>
              </div>
            </div>

            {/* Payment options */}
            <div className="flex w-full flex-col items-start gap-4 border-b border-outline-border bg-(--color-surface) p-6">
              <div className="flex items-center gap-2.5">
                <CreditCard size={18} className="text-on-surface-variant" />
                <h2 className="text-[22px] font-bold leading-[130%] text-on-surface">
                  Payment options
                </h2>
              </div>

              <div className="flex w-full flex-col items-start gap-4">
                <button
                  onClick={() => setPayment("pickup")}
                  className={`flex w-full items-center rounded-default border p-4 text-left transition-colors ${
                    payment === "pickup"
                      ? "border-2 border-primary bg-[#F4FBF4] p-[16px]"
                      : "border-outline-border bg-transparent"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      payment === "pickup"
                        ? "border-transparent bg-primary"
                        : "border-outline-border bg-surface-lowest"
                    }`}
                  >
                    {payment === "pickup" && (
                      <span className="h-2 w-2 rounded-full bg-surface-lowest" />
                    )}
                  </span>
                  <span className="ml-3 text-base font-semibold text-on-surface">
                    Pay at Pickup
                  </span>
                </button>

                <button
                  onClick={() => setPayment("digital")}
                  className={`flex w-full items-center rounded-default border p-4 text-left transition-colors ${
                    payment === "digital"
                      ? "border-2 border-primary  bg-[#F4FBF4] p-[16px]"
                      : "border-outline-border bg-transparent"
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      payment === "digital"
                        ? "border-transparent bg-primary"
                        : "border-outline-border bg-surface-lowest"
                    }`}
                  >
                    {payment === "digital" && (
                      <span className="h-2 w-2 rounded-full bg-surface-lowest" />
                    )}
                  </span>
                  <span className="ml-3 text-base font-semibold text-on-surface">
                    Digital Transfer / QR
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div className="flex w-full flex-col items-start gap-6 bg-surface-categories p-6">
              <div className="flex w-full items-start gap-3 rounded-default border border-outline-border bg-primary-fixed p-3">
                <BadgeCheck
                  size={22}
                  className="mt-0.5 shrink-0 text-primary"
                />
                <p className="text-[13px] font-semibold text-on-surface-variant">
                  First order guarantee: receive exactly what you ordered.
                </p>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handleConfirm}
                disabled={isSubmitting || cart.length === 0}
                className="flex w-full items-center justify-center rounded-[10px] bg-primary py-4.25 text-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
