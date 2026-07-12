import React from "react";
import { Info } from "lucide-react";

const CustomBasketTemplate = () => {
  return (
    <main className="min-h-screen bg-(--color-background) text-(--color-on-background) p-4 md:p-8 lg:px-16 flex flex-col items-center">
      {/* Main Content Container */}
      <div className="w-full max-w-260.75 flex flex-col gap-6 mt-4">
        {/* Custom Template Card */}
        <div className="bg-(--color-surface-lowest) rounded-md p-6 md:p-8 border border-outline-border shadow-[var(--shadow-level-1)]">
          <h2 className="text-[24px] leading-(--text-headline-sm--line-height) font-bold text-(--color-primary-container) mb-6">
            Custom Template
          </h2>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="basket-name"
              className="text-[length:var(--text-label-md)] font-[var(--text-headline-sm--font-weight)] text-[var(--color-on-surface)]"
            >
              Name this Basket:
            </label>
            <input
              type="text"
              id="basket-name"
              placeholder="Example my weekly Basket"
              className="w-full px-4 py-4 bg-[#F4FBF4] border border-[#C1C8C1] rounded-sm text-[length:var(--text-body-md)] text-[var(--color-on-surface)] outline-none focus:border-[var(--color-primary)] transition-colors placeholder:text-[var(--color-on-surface-variant)]"
            />
          </div>
        </div>

        {/* Order Table Card */}
        <div className="bg-[var(--color-surface-lowest)] rounded-[var(--radius-md)] p-6 md:p-8 border border-[var(--color-outline-variant)] shadow-[var(--shadow-level-1)]">
          <h2 className="text-[length:var(--text-headline-sm)] leading-[var(--text-headline-sm--line-height)] font-[var(--text-headline-lg--font-weight)] text-[var(--color-primary-container)] mb-6">
            Order Table:
          </h2>

          <div className="border border-[var(--color-outline-variant)] rounded-[var(--radius-sm)] overflow-hidden mb-6">
            {/* Table Header */}
            <div className="grid grid-cols-[2fr_1fr_1.5fr] bg-surface-low px-6 py-4 border-b border-[var(--color-outline-variant)]">
              <div className="text-[length:var(--text-label-sm)] font-[var(--text-headline-sm--font-weight)] text-[#414943] uppercase tracking-wider text-left">
                Item
              </div>
              <div className="text-[length:var(--text-label-sm)] font-[var(--text-headline-sm--font-weight)] text-[#414943] uppercase tracking-wider text-center">
                Qty
              </div>
              <div className="text-[length:var(--text-label-sm)] font-[var(--text-headline-sm--font-weight)] text-[#414943] uppercase tracking-wider text-right">
                Current Price per unit
              </div>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-[2fr_1fr_1.5fr] px-6 py-5 border-b border-[var(--color-outline-variant)] items-center">
              <div className="text-[length:var(--text-body-md)] font-[var(--text-headline-sm--font-weight)] text-[var(--color-on-surface)]">
                Mustard oil 1L
              </div>
              <div className="text-[length:var(--text-body-md)] text-[var(--color-on-surface-variant)] text-center">
                9
              </div>
              <div className="text-[length:var(--text-body-md)] text-[var(--color-on-surface-variant)] text-right">
                Rs. 1800
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-[2fr_1fr_1.5fr] px-6 py-5 items-center">
              <div className="text-[length:var(--text-body-md)] font-[var(--text-headline-sm--font-weight)] text-[var(--color-on-surface)]">
                Rice 20kg
              </div>
              <div className="text-[length:var(--text-body-md)] text-[var(--color-on-surface-variant)] text-center">
                10
              </div>
              <div className="text-[length:var(--text-body-md)] text-[var(--color-on-surface-variant)] text-right">
                Rs. 2300
              </div>
            </div>
          </div>

          {/* Note Alert */}
          <div className="bg-surface-categories border-l-4 border-l-(--color-primary-container) p-4 rounded-r-default flex items-start gap-3">
            <Info
              className="text-[var(--color-primary-container)] shrink-0 mt-0.5"
              size={20}
            />
            <div className="flex flex-col">
              <span className="text-[length:var(--text-label-md)] font-[var(--text-headline-sm--font-weight)] text-[var(--color-primary-container)] mb-1">
                Note:
              </span>
              <span className="text-[length:var(--text-body-md)] text-[var(--color-on-surface-variant)] leading-relaxed">
                This saves a template only. It will not order automatically.
                <br />
                Prices and stock will be checked when you use it.
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-6 mt-6 mb-12">
          <button className="w-full max-w-[320px] bg-[var(--color-primary)] text-[var(--color-on-primary)] py-4 rounded-[var(--radius-default)] text-[length:var(--text-body-lg)] font-[var(--text-headline-sm--font-weight)] hover:bg-[var(--color-primary-container)] transition-colors shadow-[var(--shadow-level-1)]">
            Save Template
          </button>

          <button className="text-[length:var(--text-body-lg)] font-[var(--text-headline-sm--font-weight)] text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
};

export default CustomBasketTemplate;
