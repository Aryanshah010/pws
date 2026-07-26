import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { useStore } from "../../store/store";
import { apiRequest } from "../../services/api";
import { wholesaleBasePrice } from "../../utils/pricing";
import { useGoBack } from "../../hooks/useBackNavigation";

export default function WholesaleApproved() {
  const { t } = useTranslation();
  const { user, token, refreshUser } = useStore();
  const navigate = useNavigate();
  const goBack = useGoBack("/homepage");
  const details = user?.wholesaleDetails || {};
  const [priceRows, setPriceRows] = useState([]);

  useEffect(() => {
    if (token) refreshUser();
  }, [token, refreshUser]);

  useEffect(() => {
    apiRequest("/products")
      .then((data) =>
        setPriceRows(
          (data.products || [])
            .filter(
              (product) =>
                wholesaleBasePrice(product) !== product.retailPrice,
            )
            .slice(0, 5)
            .map((product) => ({
              product: product.name,
              regular: `Rs.${product.retailPrice}`,
              wholesale: `Rs.${wholesaleBasePrice(product)}`,
            })),
        ),
      )
      .catch(() => setPriceRows([]));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] px-4 py-10 sm:py-16">
      <button
        onClick={goBack}
        aria-label={t("common.goBack")}
        className="p-2 hover:bg-surface-dim rounded-full transition-colors text-(--color-on-surface) mb-6 w-fit"
      >
        <ArrowLeft size={24} />
      </button>
      <div className="flex flex-1 items-center justify-center">
      <div className="flex w-full max-w-[672px] flex-col items-center rounded-2xl border border-[var(--color-outline-variant)] bg-[var(--color-surface-lowest)] p-6 shadow-[var(--shadow-level-3)] sm:p-10">
        {/* Icon */}
        <div className="flex w-24 h-24 shrink-0 items-center justify-center rounded-full border border-[var(--color-outline-variant)] bg-[#F4FBF4] mb-6 text-[var(--color-primary-container)]">
          <CheckCircle2 size={56} strokeWidth={2.5} />
        </div>

        {/* Title */}
        <h1 className="text-center text-headline-md font-semibold leading-tight text-[var(--color-primary)] mb-4">
          {t("wholesale.approvedTitle")}
        </h1>

        {/* Info */}
        <p className="text-center text-body-md leading-6 text-[var(--color-on-surface-variant)] mb-3">
          Name: {user?.fullName || "—"}
          <br />
          Shop Name: {details.shopName || "—"}
          <br />
          Location: {details.shopLocation || "—"}
          <br />
          Business Type: {details.businessType || "—"}
          <br />
          Phone Number: {user?.phone || "—"}
        </p>

        {/* Status Badge */}
        <div className="mb-6 rounded-full bg-accent px-4 py-2">
          <span className="text-[11px] font-bold rounded-full bg-[#D4820A] uppercase tracking-[1.1px] px-4 py-2 text-[var(--color-on-primary)]">
            {t("wholesale.approvedBadge")}
          </span>
        </div>

        {/* Description */}
        <p className="mb-10 max-w-[420px] text-center text-body-lg leading-6 text-[var(--color-on-surface-variant)]">
          {t("wholesale.approvedNote")}
        </p>

        {/* Price Preview Table */}
        <div className="mb-10 w-full overflow-hidden rounded-lg border border-[var(--color-outline-variant)] bg-[var(--color-background)]">
          <div className="grid grid-cols-3 gap-2 border-b border-[var(--color-outline-variant)] bg-[var(--color-surface-categories)] p-4">
            <span className="text-[13px] font-semibold uppercase leading-[15.6px] text-[var(--color-on-surface-variant)]">
              {t("common.product")}
            </span>
            <span className="text-[13px] font-semibold uppercase leading-[15.6px] text-[var(--color-on-surface-variant)] text-center sm:text-left">
              {t("wholesale.regularPrice")}
            </span>
            <span className="text-[13px] font-bold uppercase leading-[15.6px] text-[var(--color-primary)] text-right sm:text-left">
              {t("wholesale.yourWholesalePrice")}
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
          to="/homepage"
          className="flex w-full max-w-[414px] items-center justify-center rounded-[10px] bg-[var(--color-primary-container)] px-0 py-[17px] text-lg font-semibold leading-[25.2px] text-[var(--color-on-primary)] shadow-[var(--shadow-level-1)] transition-opacity hover:opacity-90"
        >
          {t("wholesale.goToHome")}
        </Link>
      </div>
      </div>
    </div>
  );
}
