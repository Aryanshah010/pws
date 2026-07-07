import { Link } from "react-router-dom";
import { CheckCircle2, Info, Download, ShoppingBag, Truck } from "lucide-react";

export default function OrderSuccess() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 sm:py-20 bg-[var(--color-background)]">
      <div className="flex w-full max-w-[860px] min-h-[522px] flex-col items-center justify-center gap-6 rounded-md border border-[var(--color-outline-border)] bg-[var(--color-surface-lowest)] px-8 py-10 text-center shadow-[var(--shadow-level-1)]">
        {/* Success Icon */}
        <div className="flex w-24 h-24 shrink-0 items-center justify-center rounded-full border border-[var(--color-outline-variant)] bg-[#F4FBF4] mb-2 text-[var(--color-primary)]">
          <CheckCircle2 size={56} strokeWidth={2.5} />
        </div>

        {/* Header Text */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-semibold text-[var(--color-on-surface)]">
            Order Placed
          </h1>
          <p className="text-base font-medium text-[#414943]">
            Order ID: PWS-001
          </p>
        </div>

        {/* Informative Alert Box */}
        <div className="flex items-center justify-center w-full gap-3 rounded-default border border-outline-border bg-[#F4FBF4] p-4 ">
          <p className="text-base font-semibold text-(--color-on-surface)">
            2 items | Total due Rs. 1100 | Pickup tomorrow 11AM-1PM
          </p>
        </div>

        <div className="text-[#414943] text-base mb-2 ">
          💬 WhatsApp/SMS confirmation sent to +977-98XXXXXXX
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="inline-flex items-center  rounded-full border border-outline-border-pill  px-4 py-1">
            <span className="text-center text-[13px] font-semibold tracking-wider text-outline-border-pill">
              PAYMENT STATUS: PENDING
            </span>
          </div>

          <div className="inline-flex items-center rounded-full bg-[var(--color-primary)] px-4 py-1">
            <span className="text-center text-[13px] font-bold tracking-wider text-[var(--color-on-primary)]">
              ORDER: PLACED
            </span>
          </div>
        </div>

        {/* CTA Button Actions wrapper */}
        <div className="flex w-full flex-col items-center justify-center gap-6 sm:flex-row mt-2">
          <button
            type="button"
            style={{ borderColor: "#C1C8C1" }}
            className="flex h-15 w-full max-w-[256px] items-center justify-center  gap-2 rounded-[10px] border bg-[#ffffff] px-6 text-lg font-semibold text-on-surface-variant transition-colors hover:bg-surface-low sm:w-[256px] cursor-pointer"
          >
            <Download className="h-5 w-5" />
            Download PDF Receipt
          </button>

          <button
            type="button"
            style={{ borderColor: "#C1C8C1" }}
            className="flex h-15 w-full max-w-[256px] items-center justify-center  gap-2 rounded-[10px] border bg-[#ffffff] px-6 text-lg font-semibold text-on-surface-variant transition-colors hover:bg-surface-low sm:w-[256px] cursor-pointer"
          >
            Submit Payment Proof
          </button>

          <Link
            to="/track-order"
            className="flex h-15 w-full items-center justify-center gap-2 rounded-[10px] bg-primary px-6 text-lg font-semibold text-(--color-on-primary) shadow-(--shadow-level-1) transition-opacity hover:opacity-90 sm:w-auto sm:min-w-67.5 cursor-pointer"
          >
            <Truck className="h-5 w-5" />
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}
