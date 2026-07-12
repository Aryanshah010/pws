import React from "react";
import { CheckCircle2, Circle, Info, Mail, Bell } from "lucide-react";

export default function TrackOrder() {
  return (
    <main className="w-full bg-[var(--color-background)] font-sans text-[var(--color-on-background)] min-h-[calc(100vh-140px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-288.75 mx-auto">
        {/* Page Title Header */}
        <div className="mb-8">
          <h1 className="text-[24px] font-semibold leading-(--text-headline-md--line-height) text-[#00452B]">
            Track Order
          </h1>
        </div>

        {/* Dynamic Responsive Two-Column Grid split */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Progress Flow Milestone Card */}
          <section className="flex-1 w-full bg-(--color-surface-lowest) rounded-md border border-outline-border shadow-(--shadow-level-1) p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-outline-border pb-6 mb-8">
              <div>
                <span className="text-(--text-label-sm) font-semibold tracking-tight uppercase">
                  Order ID
                </span>
                <h1 className="text-[16px] font-semibold text-[#00452B]">
                  PWS-001
                </h1>
              </div>
              <div className="bg-surface-categories w-50.25 h-15.5 border border-outline-border px-4 py-2 rounded-default text-right sm:text-right">
                <span className="block text-[13px] font-semibold text-[#414943] uppercase tracking-tight">
                  Estimated Pickup
                </span>
                <span className="text-base font-semibold text-(--color-primary-container)">
                  Tomorrow 11AM-1PM
                </span>
              </div>
            </div>

            {/* Vertical Flow Timeline Stepper Container */}
            <div className="relative flex flex-col gap-8 pl-2">
              {/* Stepper Vertical Track Bar */}
              <div className="absolute left-5.25 top-3 bottom-3 w-1 bg-(--color-progress-track) rounded-full overflow-hidden">
                <div className="h-[68%] w-full bg-primary transition-all duration-500" />
              </div>

              {/* Step 1: Placed (Completed) */}
              <div className="relative flex items-start gap-5">
                <div className="z-10 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[var(--color-surface-lowest)] mt-0.5">
                  <CheckCircle2 className="h-[26px] w-[26px] text-[var(--color-primary)] bg-white rounded-full shrink-0" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary">Placed</h3>
                  <p className="text-[#717973] mt-0.5">
                    Order received and confirmed by system.
                  </p>
                </div>
              </div>

              {/* Step 2: Acknowledged (Completed) */}
              <div className="relative flex items-start gap-5">
                <div className="z-10 flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[var(--color-surface-lowest)] mt-0.5">
                  <CheckCircle2 className="h-[26px] w-[26px] text-[var(--color-primary)] bg-white rounded-full shrink-0" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--color-primary)]">
                    Acknowledged
                  </h3>
                  <p className="text-[#717973] mt-0.5">
                    Shop owner has reviewed the order items.
                  </p>
                </div>
              </div>

              {/* Step 3: Ready to Pickup (Active State Indicator) */}
              <div className="relative flex items-start gap-5">
                <div className="z-10 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[var(--color-surface-lowest)] mt-0.5">
                  <Circle className="h-6 w-6 text-secondary fill-secondary stroke-[4px] shrink-0" />
                </div>
                <div>
                  <div className=" bg-[#FFDCBC]/20 border border-secondary-fixed p-4 rounded-default">
                    <h3 className="text-base font-bold text-[#D4820A]">
                      Ready to Pickup
                    </h3>
                  </div>
                  <p className="mt-0.5">
                    Your items are packed and waiting at the counter.
                  </p>
                </div>
              </div>

              {/* Step 4: Collected (Upcoming Idle Step) */}
              <div className="relative flex items-start gap-5 opacity-45">
                <div className="z-10 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[var(--color-surface-lowest)] mt-0.5">
                  <Circle className="h-[24px] w-[24px] text-[var(--color-outline-variant)] fill-[var(--color-surface-low)] stroke-[2px] shrink-0" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--color-on-surface-variant)]">
                    Collected
                  </h3>
                  <p className="text-[var(--text-body-md)] text-[var(--color-outline)] mt-0.5">
                    Order completed successfully.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Status Summary side panel layout */}
          <aside className="w-full lg:w-[410px] flex flex-col gap-6 flex-shrink-0">
            {/* Payment Status Side Card Container */}
            <div className="bg-(--color-surface-lowest) rounded-md border border-outline-border p-6 shadow-[var(--shadow-level-1)]">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-[16px] font-semibold text-(--color-primary-container)">
                  💵 Payment Status
                </h3>
              </div>

              {/* Pillar Orange Pill Badge */}
              <div className="mb-4 inline-flex items-center self-start rounded-full border border-outline-border-pill  px-4 py-1">
                <span className="text-center text-[13px] font-semibold tracking-wider text-outline-border-pill">
                  PAYMENT STATUS: SUBMITTED
                </span>
              </div>

              {/* Inner Alert Info Box */}
              <div className="flex items-start gap-3 p-4 rounded-default border border-[#F3E1C8] bg-[#FDF6ED] text-[#414943]">
                <Info size={18} className="text-[#D4820A] mt-0.5 shrink-0" />
                <p className="text-[16px] ">
                  Waiting for shop confirmation. This does not change order
                  status.
                </p>
              </div>
            </div>

            {/* Notifications Alert Summary Box */}
            <div className="bg-(--color-surface-lowest) rounded-md border border-outline-border p-6 shadow-(--shadow-level-1)">
              <div className="flex items-center gap-2 mb-4">
                <Bell size={18} className="text-(--color-primary-container)" />
                <h3 className="text-base font-bold text-(--color-primary-container)">
                  Notifications
                </h3>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-default border border-[#c6e9d2] bg-[#F4FBF4] text-on-primary-fixed-variant">
                <Mail size={18} className="text-primary shrink-0" />
                <p className="text-[16px] ">
                  You will receive push + SMS when ready.
                </p>
              </div>
            </div>

            {/* Global Actions Link */}
            <button
              type="button"
              className="w-full h-15 flex items-center justify-center rounded-[10px] bg-primary text-(--color-on-primary) text-lg font-bold shadow-[var(--shadow-level-1)] hover:bg-primary/90 active:scale-[0.99] transition-all cursor-pointer"
            >
              Back to Orders
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
