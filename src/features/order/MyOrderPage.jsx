import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  TrendingUp,
  ArrowRight,
  MessageSquareWarning,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useStore } from "../../store/store";
import { apiRequest, authHeader } from "../../services/api";
import { unitPriceFor } from "../../utils/pricing";
import { useHomePath } from "../../hooks/useBackNavigation";

function TemplateCard({ title, description, onUse }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col justify-between gap-6 rounded-md border border-outline-border bg-(--color-surface-lowest) p-6 shadow-[var(--shadow-level-1)]">
      <div className="flex flex-col gap-2 pb-4">
        <h3 className="text-base font-semibold text-(--color-primary-container)">
          {title}
        </h3>
        <p className="text-base text-[#414943]">{description}</p>
      </div>
      <button
        type="button"
        onClick={onUse}
        className="flex h-15 w-full items-center justify-center rounded-[10px] bg-[var(--color-primary)] text-lg font-semibold text-(--color-on-primary) transition-opacity hover:opacity-90 cursor-pointer"
      >
        {t("orders.useTemplate")}
      </button>
    </div>
  );
}

function OrderRow({
  orderId,
  orderStatus,
  paymentStatus,
  items,
  total,
  priceAlert,
  complaint,
  onOrderAgain,
  onMakeTemplate,
  onRaiseIssue,
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-4 border-t border-outline-border p-4 first:border-t-0 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 sm:py-6">
      <div className="flex flex-col gap-1 sm:col-span-3">
        <span className="text-base font-semibold text-(--color-primary-container)">
          {orderId}
        </span>
        <span className="text-sm text-[var(--color-on-surface-variant)]">
          {t("orders.orderLabel")}{" "}
          <span className="font-semibold text-(--color-primary-container)">
            {t(`orderStatus.${orderStatus}`)}
          </span>
        </span>
        <span className="text-sm text-[var(--color-on-surface-variant)]">
          {t("orders.paymentLabel")}{" "}
          <span className="font-semibold text-[var(--color-primary-container)]">
            {t(`paymentStatus.${paymentStatus}`)}
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:col-span-6">
        <p className="text-base  text-(--color-primary-container)">{items}</p>
        <p className="text-sm font-semibold text-(--color-on-surface)">
          {t("orders.totalLabel", { total })}
        </p>
        {priceAlert && (
          <div className="flex w-fit items-center gap-1 rounded-[var(--radius-full)] bg-[#FFDAD6] border-none px-2.5 py-1">
            <TrendingUp className="h-3.5 w-3.5 text-[var(--color-error)]" />
            <span className="text-xs font-semibold text-[var(--color-error)]">
              {priceAlert}
            </span>
          </div>
        )}
        {complaint && (
          <div className="flex w-fit flex-col gap-0.5">
            <div
              className={`flex w-fit items-center gap-1 rounded-full px-2.5 py-1 ${
                complaint.status === "Resolved"
                  ? "bg-[#aef1ca] text-[#00452b]"
                  : complaint.status === "In Review"
                    ? "bg-[#FFDCBC] text-[#6b3f00]"
                    : "bg-[#E2EAE3] text-[#404943]"
              }`}
            >
              <MessageSquareWarning className="h-3.5 w-3.5" />
              <span className="text-xs font-semibold">
                {t("orders.issueReported", {
                  status: t(`complaintStatus.${complaint.status}`),
                })}
              </span>
            </div>
            {complaint.resolutionNote && (
              <span className="text-xs text-on-surface-variant">
                “{complaint.resolutionNote}”
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col items-start gap-3 sm:col-span-3 sm:items-end">
        <div className="flex  gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onOrderAgain}
            className="rounded-[10px] w-43.5 h-10.5 border border-outline-border bg-(--color-surface-lowest) px-6 py-2 text-base font-semibold text-on-surface-variant transition-colors hover:bg-surface-low cursor-pointer"
          >
            {t("orders.orderAgain")}
          </button>
          <button
            type="button"
            onClick={onMakeTemplate}
            className="rounded-[var(--radius-default)] w-45 h-10.5 border border-[var(--color-outline-border)] bg-[var(--color-surface-lowest)] px-6 py-2 text-base font-semibold text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-low)] cursor-pointer"
          >
            {t("orders.makeTemplate")}
          </button>
        </div>
        <button
          type="button"
          onClick={onRaiseIssue}
          className="flex items-center gap-1 text-sm text-[#3F81EA] hover:underline cursor-pointer"
        >
          {t("orders.raiseIssue")} <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function MyOrder() {
  const { t } = useTranslation();
  const { token, user, loadCart, mergeIntoCart } = useStore();
  const navigate = useNavigate();
  const homePath = useHomePath();
  const [orders, setOrders] = useState([]);
  const [baskets, setBaskets] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [orderData, basketData, complaintData] = await Promise.all([
          apiRequest("/orders/myorders", { headers: authHeader(token) }),
          apiRequest("/orders/baskets", { headers: authHeader(token) }),
          apiRequest("/orders/complaints/mine", { headers: authHeader(token) }),
        ]);
        setOrders(orderData.orders);
        setBaskets(basketData.baskets);
        setComplaints(complaintData.complaints || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  const visibleOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.orderStatus === statusFilter);

  // Rebuilds a past order in the cart at today's prices. Items the shop no
  // longer sells or cannot fulfil are left out rather than added and rejected
  // at checkout, and quantities are capped at what is actually on the shelf.
  const orderAgain = (order) => {
    const available = [];
    const skipped = [];

    order.items.forEach((item) => {
      const stock = item.product?.stock ?? 0;
      if (!item.product || stock <= 0) {
        skipped.push(item.product?.name || "A removed product");
        return;
      }
      const quantity = Math.min(item.quantity, stock);
      if (quantity < item.quantity) {
        skipped.push(`${item.product.name} (only ${stock} left)`);
      }
      available.push({ product: item.product, quantity });
    });

    if (!available.length) {
      toast.error(t("orders.noneAvailable"));
      return;
    }

    mergeIntoCart(available);
    toast.success(t("orders.reordered", { qty: available.length }));
    if (skipped.length) {
      toast.warn(t("orders.adjusted", { names: skipped.join(", ") }));
    }
    navigate("/cart");
  };

  // Newest complaint wins when an order has been reported more than once.
  const complaintFor = (order) =>
    complaints.find((item) => String(item.order) === String(order._id));

  const priceAlertFor = (order) => {
    const moved = order.items.filter(
      (item) =>
        item.product?.retailPrice != null &&
        unitPriceFor(item.product, user?.role) !== item.priceAtPurchase,
    );
    if (!moved.length) return null;
    const delta = moved.reduce(
      (total, item) =>
        total +
        (unitPriceFor(item.product, user?.role) - item.priceAtPurchase) *
          item.quantity,
      0,
    );
    if (delta === 0) return null;
    return t(delta > 0 ? "orders.priceUp" : "orders.priceDown", {
      qty: moved.length,
      amount: Math.abs(delta),
    });
  };

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 py-8 sm:px-10 font-sans bg-[var(--color-background)] text-[var(--color-on-background)]">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(homePath)}
            className="flex items-center gap-xs text-label-sm font-semibold text-on-surface-variant hover:text-primary mb-2 transition-colors"
          >
            <ArrowLeft size={16} />
            {t("common.backToHome")}
          </button>
          <h1 className="text-[32px] font-(--text-headline-lg--font-weight) leading-(--text-headline-lg--line-height) text-[#00452B]">
            {t("orders.title")}
          </h1>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen((open) => !open)}
            className="flex items-center gap-1 text-base font-medium text-[var(--color-on-surface-variant)] opacity-80 hover:opacity-100 cursor-pointer"
          >
            {statusFilter === "All" ? t("orders.filter") : statusFilter}
            <ChevronDown className="h-5 w-5" />
          </button>
          {filterOpen && (
            <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-[var(--radius-default)] border border-outline-border bg-(--color-surface-lowest) shadow-[var(--shadow-level-2)]">
              {["All", "Placed", "Acknowledged", "Ready", "Collected"].map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status);
                      setFilterOpen(false);
                    }}
                    className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[var(--color-surface-low)] ${
                      statusFilter === status
                        ? "font-semibold text-(--color-primary-container)"
                        : "text-[var(--color-on-surface-variant)]"
                    }`}
                  >
                    {t(`orderStatus.${status}`)}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-[var(--text-headline-sm)] font-bold text-[var(--color-primary-container)]">
          {t("orders.savedTemplates")}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {baskets.length ? (
            baskets.map((basket) => (
              <TemplateCard
                key={basket._id}
                title={basket.name}
                description={basket.items
                  .map((item) => item.product?.name || "Product")
                  .join(", ")}

                onUse={() => navigate(`/basket-review?id=${basket._id}`)}
              />
            ))
          ) : (
            <p className="text-sm text-[#717973]">{t("orders.noBaskets")}</p>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-outline-border)] bg-[var(--color-surface-lowest)] shadow-[var(--shadow-level-1)]">
        <div className="hidden border-b border-[var(--color-outline-border)] bg-[#F5F3F0] px-4 py-4 sm:grid sm:grid-cols-12 sm:gap-4">
          <span className="col-span-3 text-[13px] font-bold uppercase tracking-[0.65px] text-[var(--color-on-surface-variant)]">
            {t("orders.order")}
          </span>
          <span className="col-span-6 text-[13px] font-bold uppercase tracking-[0.65px] text-[var(--color-on-surface-variant)]">
            {t("orders.summary")}
          </span>
          <span className="col-span-3 text-right text-[13px] font-bold uppercase tracking-[0.65px] text-[var(--color-on-surface-variant)]">
            {t("orders.action")}
          </span>
        </div>
        <div className="flex flex-col">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">
              {t("orders.loading")}
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant">
              {t("orders.noOrders")}
            </div>
          ) : (
            visibleOrders.map((order) => {
              const itemString = order.items
                .map((i) => {
                  const name = i.product?.name || t("orders.removedProduct");
                  const unit = i.product?.unit ? ` × ${i.product.unit}` : "";
                  return `${name} — ${i.quantity}${unit}`;
                })
                .join(", ");
              return (
                <OrderRow
                  key={order._id}
                  orderId={`PWS-${order._id.substring(order._id.length - 4).toUpperCase()}`}
                  orderStatus={order.orderStatus}
                  paymentStatus={order.paymentStatus}
                  items={itemString}
                  total={order.totalAmount}
                  priceAlert={priceAlertFor(order)}
                  complaint={complaintFor(order)}
                  onRaiseIssue={() =>
                    navigate(`/complain?orderId=${order._id}`)
                  }

                  onOrderAgain={() => orderAgain(order)}
                  onMakeTemplate={() => {
                    loadCart(order.items.filter((item) => item.product));
                    toast.info(t("orders.nameBasket"));
                    navigate("/custom-basket");
                  }}
                />
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
