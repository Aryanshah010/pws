import { useState } from "react";
import { ChevronDown, TrendingUp, ArrowRight } from "lucide-react";

function TemplateCard({ title, description }) {
  return (
    <div className="flex flex-col justify-between gap-6 rounded-md border border-outline-border bg-(--color-surface-lowest) p-6 shadow-[var(--shadow-level-1)]">
      <div className="flex flex-col gap-2 pb-4">
        <h3 className="text-base font-semibold text-(--color-primary-container)">
          {title}
        </h3>
        <p className="text-base text-[#414943]">{description}</p>
      </div>
      <button
        type="button"
        className="flex h-15 w-full items-center justify-center rounded-[10px] bg-[var(--color-primary)] text-lg font-semibold text-(--color-on-primary) transition-opacity hover:opacity-90 cursor-pointer"
      >
        Use Template
      </button>
    </div>
  );
}

function OrderRow({
  orderId,
  orderStatus,
  paymentStatus,
  items,
  total,
  priceAlert,
}) {
  return (
    <div className="flex flex-col gap-4 border-t border-outline-border p-4 first:border-t-0 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4 sm:py-6">
      <div className="flex flex-col gap-1 sm:col-span-3">
        <span className="text-base font-semibold text-(--color-primary-container)">
          {orderId}
        </span>
        <span className="text-sm text-[var(--color-on-surface-variant)]">
          Order:{" "}
          <span className="font-semibold text-(--color-primary-container)">
            {orderStatus}
          </span>
        </span>
        <span className="text-sm text-[var(--color-on-surface-variant)]">
          Payment:{" "}
          <span className="font-semibold text-[var(--color-primary-container)]">
            {paymentStatus}
          </span>
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:col-span-6">
        <p className="text-base  text-(--color-primary-container)">{items}</p>
        <p className="text-sm font-semibold text-(--color-on-surface)">
          Total: {total}
        </p>
        {priceAlert && (
          <div className="flex w-fit items-center gap-1 rounded-[var(--radius-full)] bg-[#FFDAD6] border-none px-2.5 py-1">
            <TrendingUp className="h-3.5 w-3.5 text-[var(--color-error)]" />
            <span className="text-xs font-semibold text-[var(--color-error)]">
              {priceAlert}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-start gap-3 sm:col-span-3 sm:items-end">
        <div className="flex  gap-3 sm:justify-end">
          <button
            type="button"
            className="rounded-[10px] w-43.5 h-10.5 border border-outline-border bg-(--color-surface-lowest) px-6 py-2 text-base font-semibold text-on-surface-variant transition-colors hover:bg-surface-low cursor-pointer"
          >
            Order Again
          </button>
          <button
            type="button"
            className="rounded-[var(--radius-default)] w-45 h-10.5 border border-[var(--color-outline-border)] bg-[var(--color-surface-lowest)] px-6 py-2 text-base font-semibold text-[var(--color-on-surface-variant)] transition-colors hover:bg-[var(--color-surface-low)] cursor-pointer"
          >
            Make Template
          </button>
        </div>
        <button
          type="button"
          className="flex items-center gap-1 text-sm text-[#3F81EA] hover:underline cursor-pointer"
        >
          Raise issue <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

const templates = [
  { title: "My Template", description: "Mustard oil, Rice" },
  { title: "Monthly Stock-UP", description: "Bulk re-usable list" },
];

const orders = [
  {
    orderId: "PWS-001",
    orderStatus: "Completed",
    paymentStatus: "Confirmed",
    items: "Mustard oil 1L, Rice 20kg",
    total: "Rs. 1900",
    priceAlert: "Mustard oil +Rs.10 since last order",
  },
  {
    orderId: "PWS-000",
    orderStatus: "Collected",
    paymentStatus: "Pay at Pickup",
    items: "Rice 25kg, Soyabean 20kg",
    total: "Rs. 1800",
  },
];

export default function MyOrder() {
  return (
    <div className="mx-auto flex max-w-[1280px] flex-col gap-8 px-6 py-8 sm:px-10 font-sans bg-[var(--color-background)] text-[var(--color-on-background)]">
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-(--text-headline-lg--font-weight) leading-(--text-headline-lg--line-height) text-[#00452B]">
          My Orders
        </h1>
        <button
          type="button"
          className="flex items-center gap-1 text-base font-medium text-[var(--color-on-surface-variant)] opacity-80 hover:opacity-100 cursor-pointer"
        >
          Filter
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="text-[var(--text-headline-sm)] font-bold text-[var(--color-primary-container)]">
          Saved Templates
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {templates.map((template) => (
            <TemplateCard key={template.title} {...template} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-outline-border)] bg-[var(--color-surface-lowest)] shadow-[var(--shadow-level-1)]">
        <div className="hidden border-b border-[var(--color-outline-border)] bg-[#F5F3F0] px-4 py-4 sm:grid sm:grid-cols-12 sm:gap-4">
          <span className="col-span-3 text-[13px] font-bold uppercase tracking-[0.65px] text-[var(--color-on-surface-variant)]">
            Order
          </span>
          <span className="col-span-6 text-[13px] font-bold uppercase tracking-[0.65px] text-[var(--color-on-surface-variant)]">
            Summary
          </span>
          <span className="col-span-3 text-right text-[13px] font-bold uppercase tracking-[0.65px] text-[var(--color-on-surface-variant)]">
            Action
          </span>
        </div>
        <div className="flex flex-col">
          {orders.map((order) => (
            <OrderRow key={order.orderId} {...order} />
          ))}
        </div>
      </section>
    </div>
  );
}
