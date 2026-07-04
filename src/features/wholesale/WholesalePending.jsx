import { Hourglass, Info } from "lucide-react";

export default function WholesalePending() {
  return (
    <div className="min-h-screen bg-color-surface flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-168 bg-(--color-surface-lowest) rounded-md border border-outline-border shadow-(--shadow-level-2) overflow-hidden">
        <div className="flex flex-col items-center px-6 py-10 sm:px-10 sm:py-10 gap-0">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 rounded-full bg-secondary-fixed flex items-center justify-center">
              <Hourglass
                size={40}
                className="text-(--color-secondary-fixed-variant)"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-[var(--color-primary)] text-center  font-semibold text-headline-md leading-8 mb-4">
            Wholesale request submitted
          </h1>

          {/* Shop Info */}
          <div className="text-[var(--color-on-surface-variant)]  text-body-md leading-6 text-center mb-4">
            <p>Shop Name: XXXXXXXXXX</p>
            <p>Location: Kathmandu</p>
            <p>Phone Number: 98XXXXX</p>
          </div>

          {/* Status Badge */}
          <div className="inline-flex px-4 py-1 rounded-full border border-outline-border-pill mb-2">
            <span className="text-outline-border-pill font-semibold text-[13px] leading-[15.6px] tracking-[0.65px]">
              STATUS: PENDING VERIFICATION
            </span>
          </div>

          {/* Description */}
          <p className="text-on-surface-variant text-body-lg leading-6 mt-2 mb-8">
            Pathivara will verify your buyer account manually.
          </p>

          {/* Info Banner */}
          <div className="w-full rounded-default border border-outline-border bg-surface-categories p-4 mb-8">
            <div className="flex items-start gap-3">
              <Info
                size={20}
                className="flex-shrink-0 mt-0.5 text-[var(--color-primary)]"
              />
              <p className="text-[var(--color-on-surface)]  text-body-lg leading-6">
                You can still browse and place pickup orders at regular buyer
                price.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
            <button className="w-full sm:w-[278px] h-[60px] bg-[var(--color-primary-container)] rounded-[10px] shadow-[var(--shadow-level-1)] text-[var(--color-on-primary)]  font-semibold text-lg leading-6 hover:bg-[var(--color-primary)] transition-colors">
              Login
            </button>
            <button className="w-full sm:w-[278px] h-[60px] bg-[var(--color-surface-lowest)] rounded-[10px] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]  font-semibold text-lg leading-6 hover:bg-[var(--color-surface-categories)] transition-colors">
              Contact on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
