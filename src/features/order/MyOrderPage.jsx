import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, TrendingUp, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { useStore } from "../../store/store";
import { apiRequest, authHeader } from "../../services/api";

function TemplateCard({ title, description, onUse }) {
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
        Use Template
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
  onOrderAgain,
  onMakeTemplate,
  onRaiseIssue,
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-outline-border p-4 first:border-t-0 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 sm:py-6">
      <div className="flex flex-col gap-1 sm:col-span-3">
        <span className="text-base font-semibold text-(--color-primary-container)">
          {orderId}
        </span>
        <span className="text-sm text-[var(--color-on-surface-variant)]">
          Order:{" "}
          <span className="font-semibold text-(--color-primary-container)">
            {orderStatus}
          </span>
        </span>
        <span className="text-sm text-[var(--color-on-surface-variant)]">
          Payment:{" "}
          <span className="font-semibold text-[var(--color-primary-container)]">
            {paymentStatus}
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:col-span-6">
        <p className="text-base  text-(--color-primary-container)">{items}</p>
        <p className="text-sm font-semibold text-(--color-on-surface)">
          Total: Rs. {total}
        </p>
        {priceAlert && (
          <div className="flex w-fit items-center gap-1 rounded-[var(--radius-full)] bg-[#FFDAD6] border-none px-2.5 py-1">
            <TrendingUp className="h-3.5 w-3.5 text-[var(--color-error)]" />
            <span className="text-xs font-semibold text-[var(--color-error)]">
              {priceAlert}
            </span>
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
            Order Again
          </button>
          <button
            type="button"
            onClick={onMakeTemplate}
            className="rounded-[var(--radius-default)] w-45 h-10.5 border border-[var(--color-outline-border)] bg-[var(--color-surface-lowest)] px-6 py-2 text-base font-semibold text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-low)] cursor-pointer"
          >
            Make Template
          </button>
        </div>
        <button
          type="button"
          onClick={onRaiseIssue}
          className="flex items-center gap-1 text-sm text-[#3F81EA] hover:underline cursor-pointer"
        >
          Raise issue <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function MyOrder() {
  const { token, loadCart } = useStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [baskets, setBaskets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const [orderData, basketData] = await Promise.all([
          apiRequest("/orders/myorders", { headers: authHeader(token) }),
          apiRequest("/orders/baskets", { headers: authHeader(token) }),
        ]);
        setOrders(orderData.orders);
        setBaskets(basketData.baskets);
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


  const priceAlertFor = (order) => {
    const moved = order.items.filter(
      (item) =>
        item.product?.retailPrice != null &&
        item.product.retailPrice !== item.priceAtPurchase,
    );
    if (!moved.length) return null;
    const delta = moved.reduce(
      (total, item) =>
        total +
        (item.product.retailPrice - item.priceAtPurchase) * item.quantity,
      0,
    );
    if (delta === 0) return null;
    return `${moved.length} item${moved.length > 1 ? "s" : ""} ${
      delta > 0 ? "up" : "down"
    } Rs. ${Math.abs(delta)} since this order`;
  };

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 py-8 sm:px-10 font-sans bg-[var(--color-background)] text-[var(--color-on-background)]">
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-(--text-headline-lg--font-weight) leading-(--text-headline-lg--line-height) text-[#00452B]">
          My Orders
        </h1>
        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen((open) => !open)}
            className="flex items-center gap-1 text-base font-medium text-[var(--color-on-surface-variant)] opacity-80 hover:opacity-100 cursor-pointer"
          >
            {statusFilter === "All" ? "Filter" : statusFilter}
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
                    {status}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-[var(--text-headline-sm)] font-bold text-[var(--color-primary-container)]">
          Saved Templates
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
                // US #42 — never load a template straight into the cart;
                // the buyer confirms today's stock and prices first.
                onUse={() => navigate(`/basket-review?id=${basket._id}`)}
              />
            ))
          ) : (
            <p className="text-sm text-[#717973]">
              No saved baskets yet. Save the current cart as a template.
            </p>
          )}
        </div>
      </section>

      <section className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-outline-border)] bg-[var(--color-surface-lowest)] shadow-[var(--shadow-level-1)]">
        <div className="hidden border-b border-[var(--color-outline-border)] bg-[#F5F3F0] px-4 py-4 sm:grid sm:grid-cols-12 sm:gap-4">
          <span className="col-span-3 text-[13px] font-bold uppercase tracking-[0.65px] text-[var(--color-on-surface-variant)]">
            Order
          </span>
          <span className="col-span-6 text-[13px] font-bold uppercase tracking-[0.65px] text-[var(--color-on-surface-variant)]">
            Summary
          </span>
          <span className="col-span-3 text-right text-[13px] font-bold uppercase tracking-[0.65px] text-[var(--color-on-surface-variant)]">
            Action
          </span>
        </div>
        <div className="flex flex-col">
          {loading ? (
            <div className="p-8 text-center text-on-surface-variant">
              Loading orders...
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant">
              No orders found.
            </div>
          ) : (
            visibleOrders.map((order) => {
              const itemString = order.items
                .map(
                  (i) =>
                    `${i.product?.name || "Removed product"} ${i.quantity}${i.product?.unit || ""}`,
                )
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
                  onRaiseIssue={() =>
                    navigate(`/complain?orderId=${order._id}`)
                  }
                  // Order Again means "this order, again" — it replaces the
                  // cart instead of adding to it, and the price is left for the
                  // cart to work out from today's catalogue rather than being
                  // frozen in here.
                  onOrderAgain={() => {
                    const usable = order.items.filter((item) => item.product);
                    loadCart(usable);
                    toast.success(
                      `${usable.length} item(s) added at today's prices`,
                    );
                    navigate("/cart");
                  }}
                  onMakeTemplate={() => {
                    loadCart(order.items.filter((item) => item.product));
                    toast.info("Name this basket to save it as a template");
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
