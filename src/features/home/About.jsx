import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { useGoBack } from "../../hooks/useBackNavigation";

export default function About() {
  const { t } = useTranslation();
  const goBack = useGoBack();

  return (
    <div className="max-w-6xl mx-auto px-md py-xl min-h-screen font-sans">
      <button
        onClick={goBack}
        aria-label={t("common.goBack")}
        className="p-2 hover:bg-surface-dim rounded-full transition-colors text-(--color-on-surface) mb-lg"
      >
        <ArrowLeft size={24} />
      </button>

      <h1 className="text-headline-md md:text-headline-lg font-bold text-primary mb-md">
        {t("about.title")}
      </h1>

      <div className="flex flex-col gap-md text-body-lg text-on-surface-variant leading-relaxed">
        <p>
          Pathivara Staples is a single-supplier B2B and B2C grocery hub
          situated in Jhapa, Nepal. We represent a streamlined, transparent
          approach to supplying essential food staples like rice, grains,
          cold-pressed oils, lentils, and spices.
        </p>

        <h2 className="text-headline-sm font-bold text-on-surface mt-sm">
          {t("about.keyDifferences")}
        </h2>
        <ul className="list-disc pl-lg flex flex-col gap-xs">
          <li>
            <strong>{t("about.sourcing")}</strong> {t("about.sourcingDesc")}
          </li>
          <li>
            <strong>{t("about.pricing")}</strong> {t("about.pricingDesc")}
          </li>
          <li>
            <strong>{t("about.pickup")}</strong> {t("about.pickupDesc")}
          </li>
          <li>
            <strong>{t("about.stock")}</strong> {t("about.stockDesc")}
          </li>
        </ul>
      </div>
    </div>
  );
}
