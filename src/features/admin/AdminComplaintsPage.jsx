import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  AlertCircle,
  CheckCircle2,
  Image,
  MessageSquareWarning,
  ShoppingBag,
  X,
} from "lucide-react";
import { useStore } from "../../store/store";
import { apiRequest, authHeader } from "../../services/api";

const ISSUE_LABELS = {
  missing: "Missing Item",
  damaged: "Damaged Item",
  wrong: "Wrong Item",
  other: "Other",
};

const STATUS_STYLES = {
  Open: "bg-[#ffdad6] text-[#ba1a1a]",
  "In Review": "bg-[#ffdcbc] text-[#6b3f00]",
  Resolved: "bg-[#aef1ca] text-[#00452b]",
};

const orderRef = (id) => `PWS-${String(id).slice(-4).toUpperCase()}`;

function PhotoLightbox({ complaint, onClose }) {
  if (!complaint) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#C1C8C1]/40 px-6 py-4">
          <div>
            <p className="text-sm font-bold text-[#1b1c1a]">
              {ISSUE_LABELS[complaint.issueType] || "Issue"} ·{" "}
              {orderRef(complaint.order?._id || complaint.order)}
            </p>
            <p className="mt-0.5 text-xs text-[#707972]">
              {complaint.user?.fullName || "Buyer"} ·{" "}
              {complaint.imageName || "photo"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#707972] transition hover:bg-[#F5F3F0] hover:text-[#1b1c1a]"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-auto bg-[#F5F3F0] p-4">
          <img
            src={complaint.imageDataUrl}
            alt={`Evidence for ${orderRef(complaint.order?._id || complaint.order)}`}
            className="mx-auto max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function ComplaintCard({ complaint, onUpdate, onViewPhoto }) {
  const [note, setNote] = useState(complaint.resolutionNote || "");
  const [busy, setBusy] = useState(false);
  const order = complaint.order;
  const isResolved = complaint.status === "Resolved";

  const submit = async (status) => {
    setBusy(true);
    try {
      await onUpdate(complaint._id, status, note);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`w-full overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
        isResolved
          ? "border-[#aef1ca]"
          : complaint.status === "In Review"
            ? "border-[#ffb86b]"
            : "border-[#C1C8C1]/40"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-[#C1C8C1]/30 bg-[#F5F3F0]/50 px-6 py-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1b5e40]">
              {orderRef(order?._id || complaint.order)}
            </p>
            <span className="text-[#bfc9c0]">·</span>
            <p className="text-xs font-bold uppercase tracking-wider text-[#707972]">
              {ISSUE_LABELS[complaint.issueType] || complaint.issueType}
            </p>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLES[complaint.status]}`}
            >
              {complaint.status}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-[#1b1c1a]">
            {complaint.user?.fullName || "Buyer"}
            {complaint.user?.phone ? (
              <span className="font-normal text-[#707972]">
                {" "}
                · {complaint.user.phone}
              </span>
            ) : null}
          </p>
        </div>
        <p className="mt-1 shrink-0 text-right text-xs text-[#707972]">
          {new Date(complaint.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-5 px-6 py-4 sm:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#707972]">
            What the buyer reported
          </p>
          <p className="whitespace-pre-line text-sm text-[#404943]">
            {complaint.description}
          </p>
          {order?.items?.length ? (
            <div className="flex items-start gap-2 text-sm text-[#707972]">
              <ShoppingBag size={13} className="mt-0.5 shrink-0" />
              <div className="space-y-0.5">
                {order.items.map((item, index) => (
                  <p key={index} className="text-xs">
                    {item.product?.name || "Product"} x{item.quantity}
                  </p>
                ))}
              </div>
            </div>
          ) : null}
          {order?.totalAmount != null && (
            <p className="text-xs text-[#707972]">
              Order total:{" "}
              <strong className="text-[#404943]">
                Rs. {order.totalAmount}
              </strong>
              {order.orderStatus ? ` · ${order.orderStatus}` : ""}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#707972]">
            Photo evidence
          </p>
          {complaint.imageDataUrl ? (
            <button
              type="button"
              onClick={() => onViewPhoto(complaint)}
              className="group relative flex h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-[#C1C8C1]/60 bg-[#F5F3F0]"
            >
              <img
                src={complaint.imageDataUrl}
                alt="Complaint evidence"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/45 text-white opacity-0 transition group-hover:opacity-100">
                <Image size={16} />
                <span className="text-xs font-semibold">View full size</span>
              </span>
            </button>
          ) : (
            <div className="flex h-32 w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-[#C1C8C1]/60 bg-[#F5F3F0] text-[#707972]">
              <AlertCircle size={20} />
              <span className="text-xs font-medium">No photo attached</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {isResolved ? (
        <div className="border-t border-[#aef1ca] bg-[#aef1ca]/20 px-6 py-3">
          <p className="flex items-center gap-2 text-sm font-semibold text-[#00452b]">
            <CheckCircle2 size={14} />
            Resolved
            {complaint.handledBy?.fullName
              ? ` by ${complaint.handledBy.fullName}`
              : ""}
          </p>
          <p className="mt-1 text-sm text-[#404943]">
            {complaint.resolutionNote}
          </p>
        </div>
      ) : (
        <div className="space-y-3 border-t border-[#C1C8C1]/30 px-6 py-4">
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={2}
            placeholder="How was this resolved? (required to resolve, shared with the buyer)"
            className="w-full resize-none rounded-xl border border-[#C1C8C1]/60 bg-[#F5F3F0] px-3 py-2 text-sm text-[#1b1c1a] outline-none transition focus:border-[#1b5e40]"
          />
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => submit("Resolved")}
              disabled={busy}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1b5e40] py-2.5 text-sm font-semibold text-white transition hover:bg-[#00452b] active:scale-95 disabled:opacity-60"
            >
              <CheckCircle2 size={16} />
              Mark Resolved
            </button>
            {complaint.status === "Open" && (
              <button
                onClick={() => submit("In Review")}
                disabled={busy}
                className="flex items-center justify-center gap-2 rounded-xl border border-[#C1C8C1]/60 px-4 py-2.5 text-sm font-semibold text-[#404943] transition hover:bg-[#F5F3F0] active:scale-95 disabled:opacity-60"
              >
                Start Review
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminComplaintsPage() {
  const { token } = useStore();
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("Open");
  const [photoInView, setPhotoInView] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadComplaints = async () => {
    try {
      const data = await apiRequest("/orders/admin/complaints", {
        headers: authHeader(token),
      });
      setComplaints(data.complaints || []);
    } catch {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) loadComplaints();
  }, [token]);

  const updateComplaint = async (id, status, resolutionNote) => {
    try {
      await apiRequest(`/orders/admin/complaints/${id}`, {
        method: "PUT",
        headers: authHeader(token),
        body: JSON.stringify({ status, resolutionNote }),
      });
      await loadComplaints();
      toast.success(
        status === "Resolved"
          ? "Complaint resolved — the buyer was notified"
          : "Complaint moved to review — the buyer was notified",
      );
    } catch (requestError) {
      toast.error(requestError.message || "Could not update the complaint");
    }
  };

  const openCount = complaints.filter((item) => item.status === "Open").length;
  const reviewCount = complaints.filter(
    (item) => item.status === "In Review",
  ).length;
  const filtered =
    filter === "all"
      ? complaints
      : complaints.filter((item) => item.status === filter);

  const TABS = [
    { key: "Open", label: `Open (${openCount})` },
    { key: "In Review", label: `In Review (${reviewCount})` },
    { key: "Resolved", label: "Resolved" },
    { key: "all", label: "All" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1b1c1a]">
          Complaints & Disputes
        </h1>
        <p className="mt-0.5 text-sm text-outline">
          Review reported order issues and record how each one was settled.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filter === key
                ? "bg-primary text-white shadow-sm"
                : "border border-[#C1C8C1]/50 bg-white text-on-surface-variant hover:bg-[#F5F3F0]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((complaint) => (
          <ComplaintCard
            key={complaint._id}
            complaint={complaint}
            onUpdate={updateComplaint}
            onViewPhoto={setPhotoInView}
          />
        ))}
        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-[#C1C8C1]/40 bg-white py-16 text-center shadow-sm">
            <MessageSquareWarning
              size={32}
              className="mx-auto mb-3 text-outline-variant"
            />
            <p className="text-sm text-outline">
              No {filter === "all" ? "" : filter.toLowerCase()} complaints
              found.
            </p>
          </div>
        )}
      </div>

      <PhotoLightbox
        complaint={photoInView}
        onClose={() => setPhotoInView(null)}
      />
    </div>
  );
}
