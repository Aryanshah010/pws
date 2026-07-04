import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const priceRows = [
  { product: "Mustard Oil", regular: "Rs.160", wholesale: "Rs.150" },
];

export default function WholesaleApproved() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4 py-10 sm:py-16">
      <div className="flex w-full max-w-[672px] flex-col items-center rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-lowest)] p-6 shadow-[var(--shadow-level-3)] sm:p-10">
        {/* Icon */}
        <div className="flex w-24 h-24 shrink-0 items-center justify-center rounded-full border border-[var(--color-outline-variant)] bg-[#F4FBF4] mb-6 text-[var(--color-primary-container)]">
          <CheckCircle2 size={56} strokeWidth={2.5} />
        </div>

        {/* Title */}
        <h1 className="text-center text-headline-md font-semibold leading-tight text-[var(--color-primary)] mb-4">
          Wholesale access approved
        </h1>

        {/* Info */}
        <p className="text-center text-body-md leading-6 text-[var(--color-on-surface-variant)] mb-3">
          Shop Name: XXXXXXXXXX
          <br />
          Location: Kathmandu
          <br />
          Phone Number: 98XXXXXXXX
        </p>

        {/* Status Badge */}
        <div className="mb-6 rounded-full bg-accent px-4 py-2">
          <span className="text-[11px] font-bold rounded-full bg-[#D4820A] uppercase tracking-[1.1px] px-4 py-2 text-[var(--color-on-primary)]">
            Verified Wholesale Buyer
          </span>
        </div>

        {/* Description */}
        <p className="mb-10 max-w-[420px] text-center text-body-lg leading-6 text-[var(--color-on-surface-variant)]">
          Wholesale prices are now active on product cards and product detail
          pages.
        </p>

        {/* Price Preview Table */}
        <div className="mb-10 w-full overflow-hidden rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-background)]">
          <div className="grid grid-cols-3 gap-2 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-categories)] p-4">
            <span className="text-[13px] font-semibold uppercase leading-[15.6px] text-[var(--color-on-surface-variant)]">
              Product
            </span>
            <span className="text-[13px] font-semibold uppercase leading-[15.6px] text-[var(--color-on-surface-variant)] text-center sm:text-left">
              Regular Price
            </span>
            <span className="text-[13px] font-bold uppercase leading-[15.6px] text-[var(--color-primary)] text-right sm:text-left">
              Your Wholesale Price
            </span>
          </div>

          {priceRows.map((row) => (
            <div key={row.product} className="grid grid-cols-3 gap-2 p-4">
              <span className="text-base font-semibold leading-[24px] text-[var(--color-primary)]">
                {row.product}
              </span>
              <span className="text-base leading-[24px] text-[var(--color-outline)] line-through text-center sm:text-left">
                {row.regular}
              </span>
              <span className="text-lg font-bold leading-[28px] text-[#D4820A] text-accent text-right sm:text-left">
                {row.wholesale}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Link */}
        <Link
          to="/"
          className="flex w-full max-w-[414px] items-center justify-center rounded-[10px] bg-[var(--color-primary-container)] px-0 py-[17px] text-lg font-semibold leading-[25.2px] text-[var(--color-on-primary)] shadow-[var(--shadow-level-1)] transition-opacity hover:opacity-90"
        >
          Go To Home
        </Link>
      </div>
    </div>
  );
}
