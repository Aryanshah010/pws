import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Minus, Plus, Trash2, ArrowLeft, TriangleAlert } from "lucide-react";
import { toast } from "react-toastify";
import { useStore } from "../../store/store";
import useCartPricing from "../../hooks/useCartPricing";
import { useGoBack } from "../../hooks/useBackNavigation";

function PriceChangeAlert({ message, onRemove, onKeep }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-start gap-4 rounded-default border border-[#FFB86B] bg-[#FFDCBC] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <TriangleAlert className="h-[19px] w-[19px] shrink-0 text-[#D4820A]" />
        <p className="text-[13px] font-semibold leading-[120%] text-[#D4820A]">
          {message}
        </p>
      </div>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onRemove}
          className="rounded-default border border-[#6B3F00] px-4 py-2 text-[13px] font-semibold text-[#6B3F00] transition-colors hover:bg-[#6B3F00]/10"
        >
          {t("common.remove")}
        </button>
        <button
          type="button"
          onClick={onKeep}
          className="rounded-default bg-[#6B3F00] px-4 py-2 text-[13px] font-semibold text-[#FFA535] transition-colors hover:bg-[#6B3F00]/90"
        >
          {t("common.keep")}
        </button>
      </div>
    </div>
  );
}

function OrderSummary({ subtotal, discount, tax, total, onCheckout }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6 rounded-md border border-[#C1C8C1] bg-white p-6 shadow-[0_1px_3px_1px_rgba(27,28,26,0.06)]">
      <h2 className="text-[22px] font-bold leading-[130%] text-[#1B1C1A]">
        {t("cart.orderSummary")}
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <span className="text-base text-[#1B1C1A]">{t("cart.subtotal")}</span>
          <span className="text-base text-[#1B1C1A]">Rs. {subtotal}</span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-base text-[#1B1C1A]">
            {t("cart.totalDiscount")}
          </span>
          <span className="text-base text-[#1B1C1A]">Rs. {discount}</span>
        </div>
        <div className="flex items-start justify-between">
          <span className="text-base text-[#1B1C1A]">{t("cart.taxFee")}</span>
          <span className="text-base text-[#1B1C1A]">Rs. {tax}</span>
        </div>
      </div>

      <div className="rounded-default border border-[#C1C8C1] bg-surface-categories p-2">
        <p className="text-center text-[13px] leading-[140%] text-[#1B1C1A]">
          {t("cart.pickupNote")}
        </p>
      </div>

      <div className="flex items-start justify-between border-t border-[#C1C8C1] pt-4">
        <span className="text-base font-semibold text-[#1B1C1A]">
          {t("cart.totalLabel")}
        </span>
        <span className="text-base font-semibold text-[#1B1C1A]">
          Rs. {total}
        </span>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        className="w-full rounded-[10px] bg-[#1B5E40] py-4.25 text-center text-lg font-semibold text-white transition-colors hover:bg-[#00452b]"
      >
        {t("cart.checkout")}
      </button>
    </div>
  );
}

function CartItemRow({ line, onIncrement, onDecrement, onRemove }) {
  const { t } = useTranslation();
  const {
    productId,
    name: productName,
    unit,
    quantity,
    subtotal,
    discount,
    final,
    threshold,
    unlocked,
    nextTier,
    segments,
  } = line;
  const remaining = threshold == null ? 0 : threshold - quantity;

  return (
    <div className="grid grid-cols-1 gap-4 border-b border-[#C1C8C1] p-6 last:border-b-0 sm:grid-cols-12 sm:items-start">
      <div className="sm:col-span-4">
        <p className="text-base font-semibold text-[#1B1C1A]">{productName}</p>
      </div>

      <div className="flex flex-col items-center gap-1.75 sm:col-span-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={t("cart.decreaseQty", { name: productName })}
            onClick={() => onDecrement(productId, quantity)}
            className="flex h-8 w-8 items-center justify-center rounded border border-[#C1C8C1] bg-[#fbf9f5] transition-colors hover:bg-[#efeeea]"
          >
            <Minus className="h-[11px] w-[11px] text-[#1B1C1A]" />
          </button>
          <div className="flex items-center gap-1 rounded border border-[#C1C8C1] bg-white px-3 py-1">
            <span className="text-base text-[#1B1C1A]">{quantity}</span>
            <span className="text-base text-[#404943]">({unit})</span>
          </div>
          <button
            type="button"
            aria-label={t("cart.increaseQty", { name: productName })}
            onClick={() => onIncrement(productId, quantity)}
            className="flex h-8 w-8 items-center justify-center rounded border border-[#C1C8C1] bg-[#fbf9f5] transition-colors hover:bg-[#efeeea]"
          >
            <Plus className="h-[11px] w-[11px] text-[#1B1C1A]" />
          </button>
        </div>

        <div className="flex w-full max-w-[200px] flex-col items-center gap-1">
          <p className="text-[13px] font-semibold text-[#404943]">
            {unlocked ? t("cart.discountUnlocked") : t("cart.noDiscount")}
          </p>
          {/* Progress Milestone Indicators */}
          <div className="flex h-3 w-full items-start justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={
                  "h-full flex-1 rounded-sm " +
                  (i < segments ? "bg-[#00452b]" : "bg-[#e4e2df]")
                }
              />
            ))}
          </div>
          {!unlocked && remaining > 0 ? (
            <p className="text-center text-[13px] leading-[140%] text-[#404943]">
              {t("cart.addMoreUnlock", {
                qty: remaining,
                unit: remaining > 1 ? `${unit}s` : unit,
              })}
            </p>
          ) : nextTier ? (
            <p className="text-center text-[13px] leading-[140%] text-[#404943]">
              {t("cart.addMoreBest", {
                qty: nextTier.minQuantity - quantity,
                unit: nextTier.minQuantity - quantity > 1 ? `${unit}s` : unit,
              })}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col items-start gap-1 pt-2 sm:col-span-3">
        <p className="text-base text-[#1B1C1A]">
          {t("cart.subtotalLine", { amount: subtotal })}
        </p>
        <p className="text-base text-[#1B1C1A]">
          {t("cart.discountLine", { amount: discount })}
        </p>
        <p className="text-base font-semibold text-[#1B1C1A]">
          {t("cart.finalLine", { amount: final })}
        </p>
      </div>

      <div className="flex justify-end sm:col-span-1 sm:justify-center sm:pt-2">
        <button
          type="button"
          aria-label={t("cart.removeItemLabel", { name: productName })}
          onClick={() => onRemove(productId)}
          className="flex h-8 w-8 items-center justify-center transition-opacity hover:opacity-70"
        >
          <Trash2 className="h-6 w-6 text-[#ba1a1a]" />
        </button>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goBack = useGoBack();
  const cart = useStore((state) => state.cart);
  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const synchronizeCartPrices = useStore(
    (state) => state.synchronizeCartPrices,
  );
  const { lines, totals, quoteItems, priceChanges } = useCartPricing();

  const increment = (id, currentQty) => updateQuantity(id, currentQty + 1);
  const decrement = (id, currentQty) => {
    if (currentQty > 1) {
      updateQuantity(id, currentQty - 1);
    }
  };

  const removeItem = (id, name) => {
    removeFromCart(id);
    toast.info(t("cart.removed", { name: name || t("common.item") }));
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={goBack}
        aria-label={t("common.goBack")}
        className="flex h-6 w-6 items-center justify-center text-[#1B1C1A] transition-opacity hover:opacity-70"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>

      {!cart || cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-[#C1C8C1] bg-white py-24 text-center">
          <p className="text-lg font-semibold text-[#1B1C1A]">
            {t("cart.empty")}
          </p>
          <p className="text-on-surface-variant">{t("cart.emptyHint")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Cart Items Card */}
          <div className="overflow-hidden rounded-md border border-[#C1C8C1] bg-white shadow-[0_1px_3px_1px_rgba(27,28,26,0.06)] lg:col-span-8">
            {priceChanges.map((change) => (
              <PriceChangeAlert
                key={change.productId}
                message={t("cart.priceChanged", {
                  name: change.name,
                  oldPrice: change.oldPrice,
                  newPrice: change.newPrice,
                })}
                onRemove={() => removeItem(change.productId, change.name)}
                onKeep={() => {
                  synchronizeCartPrices(quoteItems);
                  toast.success(t("cart.pricesUpdated"));
                }}
              />
            ))}

            <div className="hidden grid-cols-12 border-b border-[#C1C8C1] bg-[#fbf9f5] p-4 sm:grid">
              <span className="col-span-4 text-base font-semibold text-[#1B1C1A]">
                {t("cart.item")}
              </span>
              <span className="col-span-4 text-center text-base font-semibold text-[#1B1C1A]">
                {t("cart.quantity")}
              </span>
              <span className="col-span-3 text-base font-semibold text-[#1B1C1A]">
                {t("cart.total")}
              </span>
              <span className="col-span-1 text-center text-base font-semibold text-[#1B1C1A]">
                {t("cart.action")}
              </span>
            </div>

            {lines.map((line) => (
              <CartItemRow
                key={line.productId}
                line={line}
                onIncrement={increment}
                onDecrement={decrement}
                onRemove={(id) => removeItem(id, line.name)}
              />
            ))}

            <div className="flex items-center justify-between border-t border-[#C1C8C1] p-4 mb-0">
              <span className="text-base font-semibold text-[#1B1C1A]">
                {t("cart.grandTotal")}
              </span>
              <span className="text-base font-semibold text-[#1B1C1A]">
                Rs. {totals.total}
              </span>
            </div>
          </div>

          {/* Sidebar Summary Card */}
          <div className="lg:col-span-4">
            <OrderSummary
              subtotal={totals.subtotal}
              discount={totals.discount}
              tax={totals.tax}
              total={totals.total}
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        </div>
      )}
    </main>
  );
}
