import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, ChevronDown, Upload, Store, Info } from "lucide-react";

const BUSINESS_TYPES = [
  "Retail Store",
  "Grocery Shop",
  "Supermarket",
  "Restaurant / Hotel",
  "Distributor",
  "Other",
];

export default function WholesaleForm() {
  const [businessType, setBusinessType] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setUploadedFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) setUploadedFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="min-h-screen  bg-(--color-background)">
      <main className="max-w-288.75 mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-headline-md sm:text-headline-lg font-bold text-primary-container leading-tight">
            Wholesale Access Request
          </h1>
          <p className="mt-2 text-body-lg text-on-surface-variant">
            Apply for bulk pricing and specialized service.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Form Cards */}
          <div className="flex-1 min-w-0 flex flex-col gap-8">
            {/* Card 1: Shop / Bulk Buyer Details */}
            <div className="bg-(--color-surface-lowest) rounded-md border border-outline-variant shadow-[var(--shadow-level-2)] p-8">
              <h2 className="text-headline-sm sm:text-headline-md font-semibold text-(--color-primary) pb-4 border-b border-[var(--color-outline-variant)] mb-6">
                Shop / Bulk Buyer Details
              </h2>

              <div className="flex flex-col gap-6">
                {/* Shop Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold leading-[15.6px]">
                    <span className="text-[var(--color-on-surface-variant)]">
                      Shop Name{" "}
                    </span>
                    <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ram Grocery Store"
                    className="w-full px-3 py-[10px] rounded-[10px] border border-[var(--color-outline-variant)] bg-[#F4FBF4] text-body-lg text-[var(--color-on-surface-variant)] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-[var(--color-primary-container)]/30 focus:border-[var(--color-primary-container)] transition"
                  />
                </div>

                {/* Shop Location / Area */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold leading-[15.6px]">
                    <span className="text-[var(--color-on-surface-variant)]">
                      Shop Location / Area{" "}
                    </span>
                    <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-outline)]">
                      <MapPin size={20} />
                    </span>
                    <input
                      type="text"
                      placeholder="e.g. Birtamode-3, Jhapa"
                      className="w-full pl-10 pr-3 py-[10px] rounded-[10px] border border-[var(--color-outline-variant)] bg-[#F4FBF4] text-body-lg text-[var(--color-on-surface-variant)] placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-[var(--color-primary-container)]/30 focus:border-[var(--color-primary-container)] transition"
                    />
                  </div>
                </div>

                {/* Business Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold leading-[15.6px]">
                    <span className="text-[var(--color-on-surface-variant)]">
                      Business Type{" "}
                    </span>
                    <span className="text-[var(--color-error)]">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen((o) => !o)}
                      className="w-full flex items-center justify-between px-4 py-[15px] rounded-[10px] border border-[var(--color-outline-variant)] bg-[#F4FBF4] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-container)]/30 focus:border-[var(--color-primary-container)] transition"
                    >
                      <span className="text-body-lg text-[var(--color-primary)]">
                        {businessType || "Select business type"}
                      </span>
                      <ChevronDown size={24} className="text-[#1D1B20]" />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[var(--color-surface-lowest)] border border-[var(--color-outline-variant)] rounded-[10px] shadow-[var(--shadow-level-3)] overflow-hidden">
                        {BUSINESS_TYPES.map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => {
                              setBusinessType(type);
                              setDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-body-lg text-[var(--color-on-surface-variant)] hover:bg-[#F4FBF4] transition"
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Optional Verification Proof */}
            <div className="bg-[var(--color-surface-lowest)] rounded-md border border-[var(--color-outline-variant)] shadow-[var(--shadow-level-2)] p-8 pb-12">
              <h2 className="text-headline-sm sm:text-headline-md font-semibold text-[var(--color-primary)] pb-4 border-b border-[var(--color-outline-variant)] mb-6">
                Optional Verification Proof
              </h2>

              <p className="text-body-lg text-[var(--color-outline)] mb-6">
                Providing these details helps speed up the approval process.
              </p>

              <div className="flex flex-col gap-6">
                {/* PAN / VAT */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold leading-[15.6px]">
                    <span className="text-[var(--color-on-surface-variant)]">
                      PAN / VAT Number{" "}
                    </span>
                    <span className="text-[var(--color-outline)]">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your 9-digit PAN"
                    className="w-full px-3 py-2.5 rounded-[10px] border border-outline-variant bg-[#F4FBF4] text-body-lg text-on-surface-variant placeholder-[#6B7280] outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition"
                  />
                </div>

                {/* Shop Photo Upload */}
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold leading-[15.6px]">
                    <span className="text-on-surface-variant">
                      Upload Shop Photo{" "}
                    </span>
                    <span className="text-outline">(Optional)</span>
                  </label>

                  <label
                    htmlFor="shop-photo-upload"
                    className={`flex flex-col items-center justify-center gap-2 px-6 py-10 rounded-[10px] border border-dashed cursor-pointer transition ${
                      dragOver
                        ? "border-primary-container bg-[#F4FBF4]"
                        : "border-outline-variant bg-surface-low"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <Upload size={32} className="text-outline mb-1" />

                    {uploadedFile ? (
                      <p className="text-body-lg text-primary-container font-semibold text-center">
                        {uploadedFile.name}
                      </p>
                    ) : (
                      <>
                        <div className="flex items-center gap-1">
                          <span className="text-body-lg font-semibold text-[#3F81EA]">
                            Upload a file
                          </span>
                          <span className="text-body-lg text-on-surface-variant">
                            {" "}
                            or drag and drop
                          </span>
                        </div>
                        <span className="text-[13px] font-semibold text-outline">
                          PNG, JPG, GIF up to 10MB
                        </span>
                      </>
                    )}

                    <input
                      id="shop-photo-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/gif"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Side Panel */}
          <div className="w-full lg:w-118.75 lg:sticky lg:top-6 shrink-0">
            <div className="rounded-md border border-outline-variant bg-surface-categories p-6 relative">
              {/* Heading */}
              <div className="flex items-center gap-3 mb-4 text-(--color-primary)">
                <Store size={24} className="shrink-0 mt-1" />
                <h3 className="text-[22px] font-bold leading-[28.6px]">
                  Wholesale Access
                </h3>
              </div>

              {/* Description */}
              <p className="text-body-lg text-on-surface-variant leading-6 mb-6">
                Pathivara owner verifies requests before wholesale prices are
                shown to ensure dedicated service to bulk buyers.
              </p>

              {/* Warning/Info Banner */}
              <div className="flex items-start gap-3 p-4 rounded-lg border border-outline-variant bg-(--color-surface-variant) mb-8">
                <Info size={20} className="shrink-0 mt-0.5 text-[#D4820A]" />
                <p className="text-body-lg text-on-surface-variant leading-5.5">
                  Until approved, you can continue to order at regular buyer
                  prices.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                className="w-full py-4.25 rounded-[10px] bg-primary-container text-(--color-on-primary) text-lg font-semibold leading-[25.2px] shadow-(--shadow-level-1) hover:bg-[#164f35] active:bg-[#0f3a27] transition-colors mb-4"
              >
                Request Wholesale Access
              </button>

              {/* Cancel link */}
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-[13px] font-semibold text-[var(--color-on-surface-variant)] hover:underline"
                >
                  Cancel and return to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
