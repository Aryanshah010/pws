import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "../../store/store";
import { apiRequest, authHeader } from "../../services/api";
import {
  CheckCircle2,
  XCircle,
  ShoppingBag,
  CreditCard,
  Image,
  AlertCircle,
} from "lucide-react";

function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  confirmColor,
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
            className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition ${confirmColor}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Fake payment proof preview (placeholder since no real images)
function ProofPreview({ available }) {
  if (!available) {
    return (
      <div className="w-full h-32 rounded-xl border-2 border-dashed border-[#C1C8C1]/60 bg-[#F5F3F0] flex flex-col items-center justify-center gap-1.5 text-[#707972]">
        <AlertCircle size={20} />
        <span className="text-xs font-medium">No proof submitted</span>
      </div>
    );
  }
  return (
    <div className="w-full h-32 rounded-xl border border-[#C1C8C1]/60 bg-gradient-to-br from-[#E2EAE3] to-[#aef1ca]/30 flex flex-col items-center justify-center gap-1.5 text-[#1b5e40] cursor-pointer hover:opacity-80 transition relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #1b5e40 0, #1b5e40 1px, transparent 0, transparent 50%)",
          backgroundSize: "12px 12px",
        }}
      />
      <Image size={24} className="relative z-10" />
      <span className="text-xs font-semibold relative z-10">
        View Payment Proof
      </span>
      <span className="text-[10px] text-[#707972] relative z-10">
        Click to preview
      </span>
    </div>
  );
}

function PaymentCard({ pay, onApprove, onReject }) {
  const [confirmAction, setConfirmAction] = useState(null);
  const isPending = pay.status === "pending";

  return (
    <>
      <div
        className={`bg-white w-full rounded-2xl border shadow-sm overflow-hidden transition-all ${
          pay.status === "approved"
            ? "border-[#aef1ca]"
            : pay.status === "rejected"
              ? "border-[#ffdad6]"
              : "border-[#C1C8C1]/40"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#C1C8C1]/30 bg-[#F5F3F0]/50">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs font-bold text-[#707972] uppercase tracking-wider">
                {pay.id}
              </p>
              <span className="text-[#bfc9c0]">·</span>
              <p className="text-xs font-bold text-[#1b5e40] uppercase tracking-wider">
                {pay.orderId}
              </p>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  pay.status === "pending"
                    ? "bg-[#ffdad6] text-[#ba1a1a]"
                    : pay.status === "approved"
                      ? "bg-[#aef1ca] text-[#00452b]"
                      : "bg-[#E2EAE3] text-[#404943]"
                }`}
              >
                {pay.status}
              </span>
            </div>
            <p className="text-xl font-bold text-[#1b1c1a] mt-1">
              {pay.amount}
            </p>
          </div>
          <p className="text-xs text-[#707972] text-right flex-shrink-0 mt-1">
            {pay.submittedDate}
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Left: Details */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#707972]">
              Payment Details
            </p>
            <div className="flex items-center gap-2 text-sm text-[#404943]">
              <div className="w-7 h-7 rounded-full bg-[#E2EAE3] text-[#1b5e40] text-xs font-bold flex items-center justify-center flex-shrink-0">
                {pay.customerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-[#1b1c1a] text-sm">
                  {pay.customerName}
                </p>
                <p className="text-xs text-[#707972]">{pay.customerEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#707972]">
              <CreditCard size={13} className="flex-shrink-0" />
              <span>
                Payment via{" "}
                <strong className="text-[#404943]">{pay.method}</strong>
              </span>
            </div>
            <div className="flex items-start gap-2 text-sm text-[#707972]">
              <ShoppingBag size={13} className="flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                {pay.items.map((item, i) => (
                  <p key={i} className="text-xs">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Proof Preview */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#707972]">
              Payment Proof
            </p>
            <ProofPreview available={pay.proofAvailable} />
          </div>
        </div>

        {/* Actions */}
        {isPending && (
          <div className="px-6 py-4 border-t border-[#C1C8C1]/30 flex gap-3">
            <button
              onClick={() => setConfirmAction("approve")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#1b5e40] text-white text-sm font-semibold hover:bg-[#00452b] transition active:scale-95"
            >
              <CheckCircle2 size={16} />
              Mark as Paid
            </button>
            <button
              onClick={() => setConfirmAction("reject")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#C1C8C1]/60 text-[#ba1a1a] text-sm font-semibold hover:bg-[#ffdad6]/40 transition active:scale-95"
            >
              <XCircle size={16} />
              Reject
            </button>
          </div>
        )}

        {/* Approved/Rejected Banner */}
        {!isPending && (
          <div
            className={`px-6 py-3 border-t ${pay.status === "approved" ? "border-[#aef1ca] bg-[#aef1ca]/20" : "border-[#ffdad6] bg-[#ffdad6]/20"}`}
          >
            <p
              className={`text-sm font-semibold flex items-center gap-2 ${pay.status === "approved" ? "text-[#00452b]" : "text-[#ba1a1a]"}`}
            >
              {pay.status === "approved" ? (
                <CheckCircle2 size={14} />
              ) : (
                <XCircle size={14} />
              )}
              {pay.status === "approved"
                ? "Payment confirmed & order processing"
                : "Payment rejected"}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ConfirmModal
        open={confirmAction === "approve"}
        title="Confirm Payment?"
        message={`Mark ${pay.amount} from ${pay.customerName} (${pay.orderId}) as successfully paid? The order will proceed to fulfillment.`}
        confirmLabel="Yes, Confirm Payment"
        confirmColor="bg-[#1b5e40] hover:bg-[#00452b]"
        onConfirm={() => {
          onApprove(pay.id);
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmModal
        open={confirmAction === "reject"}
        title="Reject Payment?"
        message={`Reject the payment proof for order ${pay.orderId}? The customer will be notified to resubmit.`}
        confirmLabel="Reject"
        confirmColor="bg-[#ba1a1a] hover:bg-[#93000a]"
        onConfirm={() => {
          onReject(pay.id);
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
}

export default function AdminPaymentsPage() {
  const { token } = useStore();
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState("pending");
  const loadPayments = async () => {
    try {
      const data = await apiRequest("/orders/admin/all", {
        headers: authHeader(token),
      });
      setPayments(
        data.orders
          .filter((order) => order.paymentMethod === "Digital QR Transfer")
          .map((order) => ({
            id: order._id,
            orderId: `PWS-${order._id.slice(-4).toUpperCase()}`,
            status:
              order.paymentStatus === "Paid"
                ? "approved"
                : order.paymentStatus === "Rejected"
                  ? "rejected"
                  : "pending",
            amount: `Rs. ${order.totalAmount}`,
            submittedDate: order.paymentProof?.submittedAt
              ? new Date(order.paymentProof.submittedAt).toLocaleDateString()
              : "Awaiting proof",
            customerName: order.user?.fullName || "Buyer",
            customerEmail: order.user?.phone || "",
            method: "Digital QR Transfer",
            proofAvailable: Boolean(
              order.paymentProof?.imageDataUrl ||
              order.paymentProof?.transactionId,
            ),
            items: order.items.map(
              (item) => `${item.product?.name || "Product"} x${item.quantity}`,
            ),
          })),
      );
    } catch {
      setPayments([]);
    }
  };
  useEffect(() => {
    if (token) loadPayments();
  }, [token]);
  const setPayment = async (id, paymentStatus) => {
    try {
      await apiRequest(`/orders/${id}/payment-status`, {
        method: "PUT",
        headers: authHeader(token),
        body: JSON.stringify({ paymentStatus }),
      });
      await loadPayments();
      toast.success(
        paymentStatus === "Paid"
          ? "Payment confirmed — the buyer was notified"
          : "Payment rejected — the buyer was asked to resubmit",
      );
    } catch (requestError) {
      toast.error(requestError.message || "Could not update the payment");
    }
  };

  const filtered =
    filter === "all" ? payments : payments.filter((p) => p.status === filter);
  const pendingCount = payments.filter((p) => p.status === "pending").length;

  const TABS = [
    { key: "pending", label: `Pending (${pendingCount})` },
    { key: "approved", label: "Approved" },
    { key: "all", label: "All" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1b1c1a]">
          Payment Verifications
        </h1>
        <p className="text-sm text-outline mt-0.5">
          Review submitted payment proofs and confirm successful transactions.
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

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((pay) => (
          <PaymentCard
            key={pay.id}
            pay={pay}
            onApprove={(id) => setPayment(id, "Paid")}
            onReject={(id) => setPayment(id, "Rejected")}
          />
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm py-16 text-center">
            <CreditCard
              size={32}
              className="mx-auto text-outline-variant mb-3"
            />
            <p className="text-sm text-outline">No {filter} payments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
