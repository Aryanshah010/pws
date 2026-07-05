import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Info, UploadCloud } from "lucide-react";
import { toast } from "react-toastify";

const ORDER_ID = "PWS-001";
const AMOUNT = "Rs. 32900";
const QR_IMAGE_SRC =
  "https://api.builder.io/api/v1/image/assets/TEMP/f47daeeffa3a53ae63bfb12020d91e5867c40412?width=440";

export default function PaymentProofPage() {
  const [transactionId, setTransactionId] = useState("");
  const [note, setNote] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    toast.success("Payment proof submitted", {
      description: "We'll verify your payment and update the order status.",
    });
    setTransactionId("");
    setNote("");
    setFile(null);
  };

  return (
    <div className="mx-auto w-full max-w-[1512px] px-6 py-8 md:px-14 md:py-12  bg-(--color-background) text-[var(--color-on-background)]">
      <Link
        to="/"
        aria-label="Go back"
        className="mb-6 flex h-9 w-9 items-center justify-center  text-[var(--color-on-surface)] transition-opacity hover:opacity-80 cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Info Column */}
        <div className="flex flex-col gap-6">
          <div className="rounded-md border border-outline-border bg-(--color-surface-lowest) p-6 shadow-(--shadow-level-1)">
            <h1 className="text-xl font-bold text-[#00452B] sm:text-[22px]">
              Order {ORDER_ID}
            </h1>

            <div className="mt-6 flex items-center justify-between border-b border-[var(--color-outline-border)] pb-4">
              <span className="text-base text-[var(--color-on-surface-variant)]">
                Total due
              </span>
              <span className="text-xl font-bold text-[#00452B]  sm:text-[22px]">
                {AMOUNT}
              </span>
            </div>

            <div className="mt-4 inline-flex items-center self-start rounded-full border border-outline-border-pill  px-4 py-1">
              <span className="text-center text-[13px] font-semibold tracking-wider text-outline-border-pill">
                PAYMENT STATUS: PENDING
              </span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center rounded-md border border-outline-border bg-[var(--color-surface-lowest)] p-8 shadow-[var(--shadow-level-1)]">
            <div className="flex h-64 w-64 items-center justify-center overflow-hidden rounded-[var(--radius-default)] border-2 border-[var(--color-outline-border)] bg-[var(--color-surface-lowest)] p-4">
              <img
                src={QR_IMAGE_SRC}
                alt="QR Code for Payment"
                className="h-full w-full object-contain"
              />
            </div>
            <h2 className="mt-6 text-xl font-bold text-[#00452B] sm:text-[22px]">
              QR
            </h2>
            <p className="mt-2 text-center text-base text-on-surface-variant">
              Scan with any supported digital wallet or banking app.
            </p>
          </div>

          {/* Guidelines Banner */}
          <div className="flex items-start gap-3 rounded-default border border-outline-border bg-surface-categories p-4">
            <Info className="mt-0.5 h-[22px] w-5 shrink-0 text-[var(--color-on-primary-fixed-variant)]" />
            <p className="text-base leading-6 text-[var(--color-on-primary-fixed-variant)]">
              <span className="font-semibold">Send exactly {AMOUNT}</span>, then
              submit proof.
            </p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="rounded-md border border-outline-border bg-[var(--color-surface-lowest)] p-6 shadow-[var(--shadow-level-1)]">
          <h2 className="border-b border-[var(--color-outline-border)] pb-4 text-xl font-bold text-[#00452B] sm:text-[22px]">
            Submit Payment Proof
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col items-center gap-6"
          >
            {/* File Upload Area */}
            <label
              htmlFor="payment-screenshot"
              className="flex w-full cursor-pointer flex-col items-center rounded-[var(--radius-default)] border-2 border-dashed border-[var(--color-outline-border)] bg-[#F4FBF4] p-8 text-center transition-colors hover:bg-[var(--color-surface-categories)]"
            >
              <UploadCloud className="mb-4 h-9 w-9 text-[var(--color-on-surface-variant)]" />
              <span className="text-base font-medium text-[var(--color-on-surface)]">
                {file ? file.name : "Upload payment screenshot"}
              </span>
              <span className="mt-2 text-[13px] text-[var(--color-on-surface-variant)]">
                JPG, PNG up to 5MB
              </span>
              <input
                id="payment-screenshot"
                type="file"
                accept="image/jpeg,image/png"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>

            {/* Transaction ID Input */}
            <div className="w-full">
              <label
                htmlFor="transaction-id"
                className="mb-2 block text-[13px] font-semibold text-[var(--color-on-surface-variant)]"
              >
                Transaction ID optional
              </label>
              <input
                id="transaction-id"
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g., AB123456789"
                className="w-full rounded-[var(--radius-default)] border border-[var(--color-outline-border)] bg-[#F4FBF4] px-[17px] py-[17px] text-base text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            {/* Notes Textarea */}
            <div className="w-full">
              <label
                htmlFor="payment-note"
                className="mb-2 block text-[13px] font-semibold text-[var(--color-on-surface-variant)]"
              >
                Payment note optional
              </label>
              <textarea
                id="payment-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any details..."
                rows={4}
                className="w-full resize-none rounded-[var(--radius-default)] border border-[var(--color-outline-border)] bg-[#F4FBF4] px-[17px] py-[15px] text-base text-[var(--color-on-surface)] placeholder:text-[var(--color-on-surface-variant)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              />
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              className="w-full max-w-[414px] rounded-[10px] bg-[var(--color-primary)] py-[17px] text-center text-lg font-semibold text-[var(--color-on-primary)] shadow-[var(--shadow-level-1)] transition-opacity hover:opacity-90 cursor-pointer"
            >
              Submit Payment Proof
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
