import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "../../store/store";
import Spinner from "../../components/common/Spinner";
import { apiRequest, authHeader } from "../../services/api";
import {
  CheckCircle2,
  ClipboardList,
  ShoppingBag,
  Clock,
  Phone,
  NotebookPen,
} from "lucide-react";


const STAGES = ["Placed", "Acknowledged", "Ready", "Collected"];

const NEXT_STAGE = {
  Placed: { status: "Acknowledged", label: "Accept Order" },
  Acknowledged: { status: "Ready", label: "Mark Ready for Pickup" },
  Ready: { status: "Collected", label: "Mark Collected" },
};

const STAGE_STYLES = {
  Placed: "bg-[#ffdad6] text-[#ba1a1a]",
  Acknowledged: "bg-[#E2EAE3] text-[#404943]",
  Ready: "bg-[#aef1ca] text-[#00452b]",
  Collected: "bg-[#E2EAE3] text-[#404943]",
};

function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-[calc(100%-2rem)] sm:w-100 shrink-0 bg-white rounded-2xl shadow-xl p-6 z-10">
        <h3 className="text-base font-bold text-[#1b1c1a] mb-2">{title}</h3>
        <p className="text-sm text-[#707972] mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-[#404943] border border-[#C1C8C1]/60 hover:bg-[#F5F3F0] transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition bg-[#1b5e40] hover:bg-[#00452b]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function StageTrail({ current }) {
  const currentIndex = STAGES.indexOf(current);
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {STAGES.map((stage, index) => (
        <span
          key={stage}
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
            index <= currentIndex
              ? "bg-[#aef1ca] text-[#00452b]"
              : "bg-[#F5F3F0] text-[#bfc9c0]"
          }`}
        >
          {stage}
        </span>
      ))}
    </div>
  );
}

function OrderCard({ order, busy, onAdvance }) {
  const [confirming, setConfirming] = useState(false);
  const next = NEXT_STAGE[order.orderStatus];

  return (
    <>
      <div className="bg-white w-full rounded-2xl border border-[#C1C8C1]/40 shadow-sm overflow-hidden transition-all">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#C1C8C1]/30 bg-[#F5F3F0]/50">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs font-bold text-[#1b5e40] uppercase tracking-wider">
                {order.ref}
              </p>
              <span className="text-[#bfc9c0]">·</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${STAGE_STYLES[order.orderStatus]}`}
              >
                {order.orderStatus}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-[#E2EAE3] text-[#404943]">
                {order.paymentStatus}
              </span>
            </div>
            <p className="text-xl font-bold text-[#1b1c1a] mt-1">
              Rs. {order.totalAmount}
            </p>
            {order.margin !== null && (
              <p className="text-xs font-semibold text-[#707972] mt-0.5">
                Margin Rs. {Math.round(order.margin)}
                {order.discountAmount > 0
                  ? ` · after Rs. ${order.discountAmount} discount`
                  : ""}
              </p>
            )}
          </div>
          <p className="text-xs text-[#707972] text-right flex-shrink-0 mt-1">
            {order.placedOn}
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#707972]">
              Buyer
            </p>
            <div className="flex items-center gap-2 text-sm text-[#404943]">
              <div className="w-7 h-7 rounded-full bg-[#E2EAE3] text-[#1b5e40] text-xs font-bold flex items-center justify-center flex-shrink-0">
                {order.customerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[#1b1c1a] text-sm">
                  {order.customerName}
                </p>
                <p className="text-xs text-[#707972] flex items-center gap-1">
                  <Phone size={10} />
                  {order.customerPhone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#707972]">
              <Clock size={13} className="flex-shrink-0" />
              <span>
                Pickup{" "}
                <strong className="text-[#404943]">{order.pickupSlot}</strong>
              </span>
            </div>
            {order.notes && (
              <div className="flex items-start gap-2 text-sm text-[#707972]">
                <NotebookPen size={13} className="flex-shrink-0 mt-0.5" />
                <span className="text-xs italic">{order.notes}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#707972]">
              Items to pack
            </p>
            <div className="flex items-start gap-2 text-sm text-[#707972]">
              <ShoppingBag size={13} className="flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                {order.items.map((item, index) => (
                  <p key={index} className="text-xs">
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <StageTrail current={order.orderStatus} />
          </div>
        </div>

        {/* Actions */}
        {next ? (
          <div className="px-6 py-4 border-t border-[#C1C8C1]/30 flex gap-3">
            <button
              onClick={() => setConfirming(true)}
              disabled={busy}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1b5e40] text-white text-sm font-semibold hover:bg-[#00452b] transition active:scale-95 disabled:opacity-60"
            >
              {busy ? <Spinner /> : <CheckCircle2 size={16} />}
              {busy ? "Updating..." : next.label}
            </button>
          </div>
        ) : (
          <div className="px-6 py-3 border-t border-[#aef1ca] bg-[#aef1ca]/20">
            <p className="text-sm font-semibold flex items-center gap-2 text-[#00452b]">
              <CheckCircle2 size={14} />
              Order collected — nothing left to do
            </p>
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirming}
        title={`${next?.label}?`}
        message={`Move ${order.ref} for ${order.customerName} to "${next?.status}". The buyer is notified immediately by push${
          next?.status === "Collected" ? "" : " and SMS"
        }.`}
        confirmLabel={`Yes, ${next?.label}`}
        onConfirm={() => {
          onAdvance(order.id, next.status);
          setConfirming(false);
        }}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}

export default function AdminOrdersPage() {
  const { token } = useStore();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("active");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const loadOrders = async () => {
    try {
      const data = await apiRequest("/orders/admin/all", {
        headers: authHeader(token),
      });
      setOrders(
        data.orders.map((order) => ({
          id: order._id,
          ref: `PWS-${order._id.slice(-4).toUpperCase()}`,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          totalAmount: order.totalAmount,
          // What the store actually kept: the goods value after discount, less
          // what the stock cost. VAT is excluded — it belongs to the government,
          // not the shop. Null when no cost was recorded for these items.
          margin:
            order.costAmount > 0
              ? order.subtotalAmount - order.discountAmount - order.costAmount
              : null,
          discountAmount: order.discountAmount,
          pickupSlot: order.pickupSlot,
          notes: order.notes,
          placedOn: new Date(order.createdAt).toLocaleString(),
          customerName: order.user?.fullName || "Buyer",
          customerPhone: order.user?.phone || "—",
          items: order.items.map(
            (item) =>
              `${item.product?.name || "Product"} x${item.quantity}${
                item.product?.unit ? ` (${item.product.unit})` : ""
              }`,
          ),
        })),
      );
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Could not load orders");
      setOrders([]);
    }
  };

  useEffect(() => {
    if (token) loadOrders();
  }, [token]);

  const advance = async (id, orderStatus) => {
    setBusyId(id);
    try {
      await apiRequest(`/orders/${id}/status`, {
        method: "PUT",
        headers: authHeader(token),
        body: JSON.stringify({ orderStatus }),
      });
      await loadOrders();
      toast.success(`Order marked ${orderStatus} — the buyer was notified`);
    } catch (requestError) {
      const message = requestError.message || "Could not update the order";
      setError(message);
      toast.error(message);
    } finally {
      setBusyId(null);
    }
  };

  const filtered =
    filter === "all"
      ? orders
      : filter === "active"
        ? orders.filter((order) => order.orderStatus !== "Collected")
        : orders.filter((order) => order.orderStatus === filter);

  const countOf = (stage) =>
    orders.filter((order) => order.orderStatus === stage).length;

  const TABS = [
    {
      key: "active",
      label: `Active (${orders.filter((o) => o.orderStatus !== "Collected").length})`,
    },
    { key: "Placed", label: `New (${countOf("Placed")})` },
    { key: "Ready", label: `Ready (${countOf("Ready")})` },
    { key: "all", label: "All" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1b1c1a]">Order Fulfilment</h1>
        <p className="text-sm text-outline mt-0.5">
          Accept new orders, mark them ready, and close them off at pickup.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              filter === key
                ? "bg-primary text-white shadow-sm"
                : "bg-white border border-[#C1C8C1]/50 text-on-surface-variant hover:bg-[#F5F3F0]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-[#ffdad6] bg-[#ffdad6]/40 px-4 py-3 text-sm font-semibold text-[#ba1a1a]">
          {error}
        </div>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            busy={busyId === order.id}
            onAdvance={advance}
          />
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm py-16 text-center">
            <ClipboardList
              size={32}
              className="mx-auto text-outline-variant mb-3"
            />
            <p className="text-sm text-outline">No orders in this view.</p>
          </div>
        )}
      </div>
    </div>
  );
}
