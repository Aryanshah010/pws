import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CheckCircle2, Circle, Info, Mail, Bell, ArrowLeft, ChevronDown } from "lucide-react";
import { useGoBack } from "../../hooks/useBackNavigation";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { API_URL, apiRequest, authHeader } from "../../services/api";

const steps = ["Placed", "Acknowledged", "Ready", "Collected"];

// ─── Single order card (same layout as original) ────────────────────────────
function OrderCard({ order }) {
  const { t } = useTranslation();
  const currentStep = Math.max(0, steps.indexOf(order.orderStatus));

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <section className="flex-1 w-full bg-(--color-surface-lowest) rounded-md border border-outline-border shadow-(--shadow-level-1) p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-border pb-6 mb-8">
          <div>
            <span className="text-(--text-label-sm) font-semibold uppercase">
              {t("track.orderId")}
            </span>
            <h2 className="text-[16px] font-semibold text-[#00452B]">
              {`PWS-${order._id.slice(-4).toUpperCase()}`}
            </h2>
          </div>
          <div className="bg-surface-categories border border-outline-border px-4 py-2 rounded-default">
            <span className="block text-[13px] font-semibold text-[#414943] uppercase">
              {t("track.pickup")}
            </span>
            <span className="text-base font-semibold text-(--color-primary-container)">
              {order.pickupSlot}
            </span>
          </div>
        </div>
        <div className="relative flex flex-col gap-8 pl-2">
          {steps.map((step, index) => {
            const complete = index <= currentStep;
            const active = index === currentStep;
            return (
              <div
                key={step}
                className={`relative flex items-start gap-5 ${index > currentStep ? "opacity-45" : ""}`}
              >
                <div className="z-10 mt-0.5">
                  {complete ? (
                    <CheckCircle2 className="h-[26px] w-[26px] text-[var(--color-primary)] bg-white rounded-full" />
                  ) : (
                    <Circle className="h-[24px] w-[24px] text-[var(--color-outline-variant)]" />
                  )}
                </div>
                <div
                  className={
                    active
                      ? "rounded-default border border-secondary-fixed p-4"
                      : ""
                  }
                >
                  <h3
                    className={`text-base font-bold ${active ? "text-[#D4820A]" : "text-primary"}`}
                  >
                    {step}
                  </h3>
                  <p className="text-[#717973] mt-0.5">
                    {step === "Placed"
                      ? "Order received."
                      : step === "Acknowledged"
                        ? "Shop owner has reviewed the items."
                        : step === "Ready"
                          ? "Items are ready for pickup."
                          : "Order completed successfully."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <aside className="w-full lg:w-[410px] flex flex-col gap-6 flex-shrink-0">
        <div className="bg-(--color-surface-lowest) rounded-md border border-outline-border p-6 shadow-[var(--shadow-level-1)]">
          <h3 className="text-[16px] font-semibold text-(--color-primary-container) mb-4">
            💵 Payment Status
          </h3>
          <div className="mb-4 inline-flex rounded-full border border-outline-border-pill px-4 py-1">
            <span className="text-[13px] font-semibold tracking-wider">
              PAYMENT STATUS: {order.paymentStatus}
            </span>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-default border border-[#F3E1C8] bg-[#FDF6ED]">
            <Info size={18} className="text-[#D4820A] mt-0.5 shrink-0" />
            <p>
              {order.paymentStatus === "Paid"
                ? "Payment confirmed by Pathivara."
                : "Payment status is separate from pickup status."}
            </p>
          </div>
        </div>
        <div className="bg-(--color-surface-lowest) rounded-md border border-outline-border p-6 shadow-(--shadow-level-1)">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} />
            <h3 className="text-base font-bold">
              {t("track.notifications")}
            </h3>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-default border border-[#c6e9d2] bg-[#F4FBF4]">
            <Mail size={18} />
            <p>{t("track.notificationsNote")}</p>
          </div>
        </div>
        <Link
          to="/myorder"
          className="w-full h-15 flex items-center justify-center rounded-[10px] bg-primary text-(--color-on-primary) text-lg font-bold"
        >
          {t("track.backToOrders")}
        </Link>
      </aside>
    </div>
  );
}

// ─── Collapsible accordion wrapper for multi-order view ─────────────────────
function CollapsibleOrder({ order, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const orderId = `PWS-${order._id.slice(-4).toUpperCase()}`;

  return (
    <div className="flex flex-col">
      {/* Accordion heading / toggle */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={open}
      >
        <h2 className="text-[18px] font-semibold text-[#00452B]">{orderId}</h2>
        <ChevronDown
          size={20}
          className="text-[#00452B] transition-transform duration-200 shrink-0"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Collapsible content */}
      {open && (
        <div className="mt-6">
          <OrderCard order={order} />
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function TrackOrder() {
  const { t } = useTranslation();
  const { token, checkoutOrder } = useStore();
  const navigate = useNavigate();
  const goBack = useGoBack("/homepage");
  const [orders, setOrders] = useState(checkoutOrder ? [checkoutOrder] : []);
  const [loading, setLoading] = useState(!checkoutOrder);

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const data = await apiRequest("/orders/myorders", {
          headers: authHeader(token),
        });
        const allOrders = data.orders || [];
        setOrders(allOrders);
      } finally {
        setLoading(false);
      }
    };
    load();
    const stream = new EventSource(
      `${API_URL}/events?token=${encodeURIComponent(token)}`,
    );
    stream.addEventListener("order-updated", load);
    return () => stream.close();
  }, [token]);

  if (loading)
    return <div className="p-8 text-center">{t("track.loading")}</div>;
  if (!orders.length)
    return (
      <div className="p-8 text-center">
        No order found.{" "}
        <Link className="text-primary underline" to="/myorder">
          {t("track.viewMyOrders")}
        </Link>
      </div>
    );

  const single = orders.length === 1;

  return (
    <main className="w-full bg-[var(--color-background)] font-sans text-[var(--color-on-background)] min-h-[calc(100vh-140px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-288.75 mx-auto">
        <div className="mb-8">
          <button
            onClick={goBack}
            aria-label={t("common.goBack")}
            className=" hover:bg-surface-dim rounded-full transition-colors text-(--color-on-surface) mb-2"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-[24px] font-semibold text-[#00452B]">
            {t("track.title")}
          </h1>
        </div>

        {single ? (
          // ── Single order: original layout, unchanged ──
          <OrderCard order={orders[0]} />
        ) : (
          // ── Multiple orders: each in its own collapsible section ──
          <div className="flex flex-col gap-8">
            {orders.map((order, idx) => (
              <CollapsibleOrder
                key={order._id}
                order={order}
                defaultOpen={idx === 0}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
