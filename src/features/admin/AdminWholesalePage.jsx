import { useState } from "react";
import { useAdminStore } from "../../store/adminStore";
import {
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Store,
  FileText,
  Image,
  Filter,
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

      <div className="relative w-[calc(100%-2rem)] sm:w-[400px] flex-shrink-0 bg-white rounded-2xl shadow-xl p-6 z-10 box-border">
        <h3 className="text-base font-bold text-[#1b1c1a] mb-2">{title}</h3>
        <p className="text-sm text-[#707972] mb-6">{message}</p>

        <div className="flex gap-3 justify-end w-full">
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

function WholesaleCard({ req, onApprove, onReject }) {
  const [confirmAction, setConfirmAction] = useState(null); // 'approve' | 'reject'
  const isPending = req.status === "pending";

  return (
    <>
      <div
        className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
          req.status === "approved"
            ? "border-[#aef1ca]"
            : req.status === "rejected"
              ? "border-[#ffdad6]"
              : "border-[#C1C8C1]/40"
        }`}
      >
        {/* Card Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#C1C8C1]/30 bg-[#F5F3F0]/50">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-[#707972] uppercase tracking-wider">
                {req.id}
              </p>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                ${req.status === "pending" ? "bg-[#fff8e0] text-[#895100]" : req.status === "approved" ? "bg-[#aef1ca] text-[#00452b]" : "bg-[#ffdad6] text-[#ba1a1a]"}`}
              >
                {req.status}
              </span>
            </div>
            <p className="text-base font-bold text-[#1b1c1a] mt-1">
              {req.shopName}
            </p>
          </div>
          <p className="text-xs text-[#707972] text-right flex-shrink-0 mt-1">
            {req.submittedDate}
          </p>
        </div>

        {/* Card Body */}
        <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Customer Info */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#707972] mb-3">
              Customer
            </p>
            <div className="flex items-center gap-2 text-sm text-[#404943]">
              <div className="w-7 h-7 rounded-full bg-[#E2EAE3] text-[#1b5e40] text-xs font-bold flex items-center justify-center flex-shrink-0">
                {req.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-[#1b1c1a]">{req.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#707972]">
              <Phone size={13} className="flex-shrink-0" />
              <span>{req.phone}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-[#707972]">
              <MapPin size={13} className="flex-shrink-0 mt-0.5" />
              <span>{req.location}</span>
            </div>
          </div>

          {/* Business Info */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#707972] mb-3">
              Business
            </p>
            <div className="flex items-center gap-2 text-sm text-[#404943]">
              <Store size={13} className="flex-shrink-0 text-[#1b5e40]" />
              <span className="font-semibold">{req.businessType}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#707972]">
              <FileText size={13} className="flex-shrink-0" />
              <span>
                PAN/VAT:{" "}
                {req.panVat || <em className="text-[#bfc9c0]">Not provided</em>}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#707972]">
              <Image size={13} className="flex-shrink-0" />
              <span>
                {req.hasPhoto ? (
                  "Shop photo uploaded"
                ) : (
                  <em className="text-[#bfc9c0]">No photo</em>
                )}
              </span>
            </div>
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
              Approve
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
            className={`px-6 py-3 border-t ${req.status === "approved" ? "border-[#aef1ca] bg-[#aef1ca]/20" : "border-[#ffdad6] bg-[#ffdad6]/20"}`}
          >
            <p
              className={`text-sm font-semibold flex items-center gap-2 ${req.status === "approved" ? "text-[#00452b]" : "text-[#ba1a1a]"}`}
            >
              {req.status === "approved" ? (
                <CheckCircle2 size={14} />
              ) : (
                <XCircle size={14} />
              )}
              {req.status === "approved"
                ? "Wholesale access granted"
                : "Request rejected"}
            </p>
          </div>
        )}
      </div>

      {/* Confirm modals */}
      <ConfirmModal
        open={confirmAction === "approve"}
        title="Approve Wholesale Access?"
        message={`This will grant wholesale pricing to ${req.name} for shop "${req.shopName}". This action can be reviewed later.`}
        confirmLabel="Yes, Approve"
        confirmColor="bg-[#1b5e40] hover:bg-[#00452b]"
        onConfirm={() => {
          onApprove(req.id);
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
      <ConfirmModal
        open={confirmAction === "reject"}
        title="Reject this request?"
        message={`You are about to reject the wholesale request from "${req.shopName}". The customer will remain on regular pricing.`}
        confirmLabel="Reject"
        confirmColor="bg-[#ba1a1a] hover:bg-[#93000a]"
        onConfirm={() => {
          onReject(req.id);
          setConfirmAction(null);
        }}
        onCancel={() => setConfirmAction(null)}
      />
    </>
  );
}

export default function AdminWholesalePage() {
  const { wholesaleRequests, approveWholesale, rejectWholesale } =
    useAdminStore();
  const [filter, setFilter] = useState("pending");

  const filtered =
    filter === "all"
      ? wholesaleRequests
      : wholesaleRequests.filter((r) => r.status === filter);
  const pendingCount = wholesaleRequests.filter(
    (r) => r.status === "pending",
  ).length;

  const TABS = [
    { key: "pending", label: `Pending (${pendingCount})` },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
    { key: "all", label: "All" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1b1c1a]">
          Wholesale Requests
        </h1>
        <p className="text-sm text-[#707972] mt-0.5">
          Review and approve wholesale buyer / shop owner applications.
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
                ? "bg-[#1b5e40] text-white shadow-sm"
                : "bg-white border border-[#C1C8C1]/50 text-[#404943] hover:bg-[#F5F3F0]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((req) => (
          <WholesaleCard
            key={req.id}
            req={req}
            onApprove={approveWholesale}
            onReject={rejectWholesale}
          />
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm py-16 text-center">
            <Filter size={32} className="mx-auto text-[#bfc9c0] mb-3" />
            <p className="text-sm text-[#707972]">
              No {filter} requests found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
