import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Info,
  Download,
  MessageCircle,
  Truck,
} from "lucide-react";
import { useStore } from "../../store/store";
import { downloadReceipt } from "../../utils/pdfGenerator";
import { apiRequest } from "../../services/api";

export default function PaymentProofSubmitted() {
  const { t } = useTranslation();
  const { checkoutOrder } = useStore();
  const orderId = checkoutOrder
    ? `PWS-${checkoutOrder._id.slice(-4).toUpperCase()}`
    : "—";
  const [whatsApp, setWhatsApp] = useState("");

  useEffect(() => {
    apiRequest("/settings")
      .then((data) => setWhatsApp(data.settings?.contactWhatsApp || ""))
      .catch(() => setWhatsApp(""));
  }, []);
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 sm:py-20 bg-[var(--color-background)]">
      <div className="flex w-full max-w-[782px] min-h-[522px] flex-col items-center justify-center gap-6 rounded-md border border-[var(--color-outline-border)] bg-[var(--color-surface-lowest)] px-8 py-10 text-center shadow-[var(--shadow-level-1)]">
        {/* Success Icon */}
        <div className="flex w-24 h-24 shrink-0 items-center justify-center rounded-full border border-[var(--color-outline-variant)] bg-[#F4FBF4] mb-2 text-[var(--color-primary-container)]">
          <CheckCircle2 size={56} strokeWidth={2.5} />
        </div>

        {/* Header Text */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-semibold text-[var(--color-on-surface)]">
            {t("proofSubmitted.title")}
          </h1>
          <p className="text-base font-medium text-[var(--color-on-surface-variant)]">
            Order ID: {orderId}
          </p>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center  rounded-full border border-outline-border-pill  px-4 py-1">
          <span className="text-center text-[13px] font-semibold tracking-wider text-outline-border-pill">
            PAYMENT STATUS: {checkoutOrder?.paymentStatus || "PENDING"}
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-base text-on-surface-variant">
          {t("proofSubmitted.subtitle")}
        </p>

        {/* Informative Alert Box */}
        <div className="flex w-full items-start gap-3 rounded-default border border-outline-border bg-surface-categories p-4 text-left">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-primary)]" />
          <p className="text-base text-[var(--color-on-surface)]">
            {t("proofSubmitted.note")}
          </p>
        </div>

        {/* CTA Button Actions wrapper */}
        <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4 mt-2">
          <Link
            to="/track"
            className="flex h-[60px] w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--color-primary)] px-6 text-lg font-semibold text-(--color-on-primary) shadow-[var(--shadow-level-1)] transition-opacity hover:opacity-90 sm:w-auto sm:min-w-[189px] cursor-pointer"
          >
            <Truck className="h-5 w-5" />
            {t("proofSubmitted.trackOrder")}
          </Link>

          <button
            type="button"
            onClick={() => checkoutOrder && downloadReceipt(checkoutOrder)}
            style={{ borderColor: "#C1C8C1" }}
            className="flex h-15 w-full max-w-[256px] items-center justify-center  gap-2 rounded-[10px] border bg-[#ffffff] px-6 text-lg font-semibold text-on-surface-variant transition-colors hover:bg-surface-low sm:w-[256px] cursor-pointer"
          >
            <Download className="h-5 w-5" />
            {t("common.downloadReceipt")}
          </button>

          {whatsApp && (
            <a
              href={`https://wa.me/${whatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ borderColor: "#C1C8C1" }}
              className="flex h-15 w-full max-w-[256px] items-center justify-center gap-2 rounded-[10px] border bg-[#ffffff] px-6 text-lg font-semibold text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-low)] sm:w-[256px] cursor-pointer"
            >
              <MessageCircle className="h-5 w-5" />
              {t("common.contactWhatsApp")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
