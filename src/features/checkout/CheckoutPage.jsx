import { useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useStore } from "../../store/store";
import Spinner from "../../components/common/Spinner";
import useCartPricing from "../../hooks/useCartPricing";
import { useGoBack } from "../../hooks/useBackNavigation";
import { apiRequest, authHeader } from "../../services/api";

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goBack = useGoBack("/cart");
  const {
    user,
    token,
    cart,
    clearCart,
    setCheckoutOrder,
    synchronizeCartPrices,
  } = useStore();
  const [day, setDay] = useState("today");
  const [timeSlot, setTimeSlot] = useState("");
  const [payment, setPayment] = useState("digital");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    apiRequest("/settings")
      .then((data) => {
        const slots = data.settings?.pickupSlots || [];
        setTimeSlots(slots);
        setTimeSlot((current) => current || slots[0]?.label || "");
      })
      .catch(() => setTimeSlots([]));
  }, []);

  const { totals } = useCartPricing();
  const { subtotal, discount, tax, total: grandTotal } = totals;

  const handleConfirm = async () => {
    if (!cart || cart.length === 0) return;
    if (!user || !token) return navigate("/login");
    setIsSubmitting(true);
    setError(null);
    try {
      const data = await apiRequest("/orders", {
        method: "POST",
        headers: {
          ...authHeader(token),
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            expectedUnitPrice: item.price,
          })),
          pickupSlot: `${day} ${timeSlot}`,
          paymentMethod:
            payment === "digital" ? "Digital QR Transfer" : "Pay at Pickup",
          notes,
        }),
      });
      setCheckoutOrder(data.order);
      clearCart();
      toast.success(t("checkout.orderPlaced"));
      navigate(payment === "digital" ? "/payment" : "/order-success");
    } catch (err) {
      if (err.data?.items) synchronizeCartPrices(err.data.items);
      setError(err.message);
      toast.error(err.message || "Could not place the order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1512px] px-4 py-10 sm:px-8 lg:px-[100px] lg:py-14 2xl:px-[202px]  bg-background text-on-background">
      <div className="mb-8 flex items-center gap-3">
        <button
          onClick={goBack}
          aria-label={t("common.goBack")}
          className="flex h-6 w-6 items-center justify-center text-on-surface transition-opacity hover:opacity-70"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-[32px] font-bold leading-10 text-on-surface">
          {t("checkout.title")}
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
                  {t("checkout.contactDetails")}
                </h2>
              </div>
              <button className="text-[13px] font-semibold text-[#3F81EA] transition-opacity hover:opacity-80">
                {t("checkout.edit")}
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
                {t("checkout.pickupSlot")}
              </h2>
            </div>

            <div className="flex w-full flex-col items-start gap-3">
              <span className="text-[13px] font-semibold uppercase tracking-[0.65px] text-on-surface-variant">
                {t("checkout.selectDay")}
              </span>
              <div className="flex items-start gap-3">
                {[
                  { id: "today", label: t("checkout.today") },
                  { id: "tomorrow", label: t("checkout.tomorrow") },
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
                {t("checkout.selectTime")}
              </span>
              <div className="flex flex-wrap items-start gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.label}
                    onClick={() => setTimeSlot(slot.label)}
                    className={`rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${
                      timeSlot === slot.label
                        ? "border-primary bg-primary text-white"
                        : "border-outline-border bg-surface-lowest text-on-surface-variant"
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
                {timeSlots.length === 0 && (
                  <p className="text-base text-on-surface-variant">
                    {t("checkout.noSlots")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex w-full items-start gap-3 rounded-default border border-outline-border bg-surface-categories p-3">
              <Info
                size={20}
                className="mt-0.5 shrink-0 text-on-surface-variant"
              />
              <p className="text-base text-on-surface-variant">
                {t("checkout.pickupOnly")}
              </p>
            </div>
          </section>

          {/* Order Notes */}
          <section className="flex w-full flex-col items-start gap-4 rounded-md border border-outline-border bg-surface-lowest p-6 shadow-sm">
            <div className="flex items-center gap-3.5">
              <NotebookPen size={18} className="text-on-surface-variant" />
              <h2 className="text-[22px] font-bold leading-[130%] text-on-surface">
                {t("checkout.orderNotes")}
              </h2>
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("checkout.notesPlaceholder")}
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
                {t("checkout.priceBreakdown")}
              </h2>
              <div className="flex w-full flex-col items-start gap-4">
                <div className="flex w-full items-start justify-between">
                  <span className="text-base text-on-surface-variant">
                    {t("checkout.subtotal")}
                  </span>
                  <span className="text-base text-on-surface-variant">
                    Rs.{subtotal}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex w-full items-start justify-between">
                    <span className="text-base text-on-surface-variant">
                      {t("checkout.bulkDiscount")}
                    </span>
                    <span className="text-base text-on-surface-variant">
                      -Rs.{discount}
                    </span>
                  </div>
                )}
                <div className="flex w-full items-start justify-between">
                  <span className="text-base text-on-surface-variant">
                    {t("checkout.taxFee")}
                  </span>
                  <span className="text-base text-on-surface-variant">
                    Rs.{tax}
                  </span>
                </div>
              </div>
              <div className="flex w-full items-center justify-between border-t border-outline-border pt-4">
                <span className="text-[22px] font-bold text-on-surface">
                  {t("checkout.totalDue")}
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
                  {t("checkout.paymentOptions")}
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
                    {t("checkout.payAtPickup")}
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
                    {t("checkout.digitalTransfer")}
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
                  {t("checkout.guarantee")}
                </p>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handleConfirm}
                disabled={isSubmitting || cart.length === 0 || !timeSlot}
                className="flex w-full items-center justify-center rounded-[10px] bg-primary py-4.25 text-lg font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Spinner size={18} />
                    {t("checkout.placingOrder")}
                  </span>
                ) : (
                  t("checkout.placeOrder")
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
