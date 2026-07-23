import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useHomePath } from "../../hooks/useBackNavigation";

export default function About() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const homePath = useHomePath();

  return (
    <div className="max-w-6xl mx-auto px-md py-xl min-h-screen font-sans">
      <button
        onClick={() => navigate(homePath)}
        className="flex items-center gap-xs text-label-sm font-semibold text-on-surface-variant hover:text-primary mb-lg transition-colors"
      >
        <ArrowLeft size={16} />
        {t("common.backToHome")}
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
