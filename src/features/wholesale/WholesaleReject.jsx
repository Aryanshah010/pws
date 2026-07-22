import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, Info } from "lucide-react";
import { useStore } from "../../store/store";
import { apiRequest } from "../../services/api";

export default function WholesaleRejected() {
  const { user } = useStore();
  const navigate = useNavigate();
  const details = user?.wholesaleDetails || {};
  const [whatsApp, setWhatsApp] = useState("");

  useEffect(() => {
    apiRequest("/settings")
      .then((data) => setWhatsApp(data.settings?.contactWhatsApp || ""))
      .catch(() => setWhatsApp(""));
  }, []);

  return (
    <div className="min-h-screen bg-color-surface flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-168 bg-(--color-surface-lowest) rounded-md border border-outline-border shadow-(--shadow-level-2) overflow-hidden">
        <div className="flex flex-col items-center px-6 py-10 sm:px-10 sm:py-10 gap-0">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 rounded-full bg-[#ffdad6] flex items-center justify-center">
              <XCircle size={40} className="text-[#ba1a1a]" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-[var(--color-primary)] text-center font-semibold text-headline-md leading-8 mb-4">
            Wholesale request not approved
          </h1>

          {/* Shop Info */}
          <div className="text-[var(--color-on-surface-variant)] text-body-md leading-6 text-center mb-4">
            <p>Shop Name: {details.shopName || "—"}</p>
            <p>Location: {details.shopLocation || "—"}</p>
            <p>Phone Number: {user?.phone || "—"}</p>
          </div>

          {/* Status Badge */}
          <div className="inline-flex px-4 py-1 rounded-full border border-[#ba1a1a] mb-2">
            <span className="text-[#ba1a1a] font-semibold text-[13px] leading-[15.6px] tracking-[0.65px]">
              STATUS: REJECTED
            </span>
          </div>

          {/* Description */}
          <p className="text-on-surface-variant text-body-lg leading-6 mt-2 mb-8">
            Pathivara could not verify your buyer account this time.
          </p>

          {/* Info Banner */}
          <div className="w-full rounded-default border border-outline-border bg-surface-categories p-4 mb-8">
            <div className="flex items-start gap-3">
              <Info
                size={20}
                className="flex-shrink-0 mt-0.5 text-[var(--color-primary)]"
              />
              <p className="text-[var(--color-on-surface)] text-body-lg leading-6">
                Your account stays active at regular buyer price. You can apply
                again with updated shop details at any time.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
            <button
              onClick={() => navigate("/wholesale-form")}
              className="w-full sm:w-[278px] h-[60px] bg-[var(--color-primary-container)] rounded-[10px] shadow-[var(--shadow-level-1)] text-[var(--color-on-primary)] font-semibold text-lg leading-6 hover:bg-[var(--color-primary)] transition-colors"
            >
              Apply again
            </button>
            {whatsApp ? (
              <a
                href={`https://wa.me/${whatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-[278px] h-[60px] bg-[var(--color-surface-lowest)] rounded-[10px] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] font-semibold text-lg leading-6 hover:bg-[var(--color-surface-categories)] transition-colors flex items-center justify-center"
              >
                Contact on WhatsApp
              </a>
            ) : (
              <button
                onClick={() => navigate("/homepage")}
                className="w-full sm:w-[278px] h-[60px] bg-[var(--color-surface-lowest)] rounded-[10px] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)] font-semibold text-lg leading-6 hover:bg-[var(--color-surface-categories)] transition-colors"
              >
                Continue shopping
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
