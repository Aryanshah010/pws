import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../../store/store";
import { Check } from "lucide-react";

export default function LanguageModal() {
  const { t, i18n } = useTranslation();
  const { language, setLanguage, onboarded, setOnboarded } = useStore();

  // Local state to manage active selection before committing
  const [selectedLang, setSelectedLang] = useState(language);

  // If user is already onboarded, don't show the modal
  if (onboarded) return null;

  const handleSelect = (lang) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const handleProceed = () => {
    setOnboarded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-6">
      <div className="w-full max-w-[520px] bg-[var(--color-surface-lowest)] rounded-[var(--radius-lg)] border border-[var(--color-outline-border)] shadow-[var(--shadow-level-3)] p-8 flex flex-col gap-6 transition-all">
        {/* Header */}
        <div className="text-center flex flex-col items-center">
          <div className="w-[72px] h-[72px] rounded-[var(--radius-full)] bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-on-primary)] font-bold text-[var(--text-headline-lg)] mb-4 shadow-[var(--shadow-level-2)]">
            P
          </div>
          <h2 className="font-sans text-[var(--text-headline-sm)] font-bold text-[var(--color-on-surface)] leading-snug">
            {t("onboarding.title")}
          </h2>
          <p className="font-sans text-base text-[var(--color-on-surface-variant)] mt-2 max-w-sm">
            {t("onboarding.subtitle")}
          </p>
        </div>

        {/* Language Selection Grid */}
        <div className="grid grid-cols-1 gap-4 py-2">
          {/* English Option */}
          <button
            onClick={() => handleSelect("en")}
            className={`flex items-center justify-between p-5 rounded-[var(--radius-md)] border-2 text-left font-sans transition-all duration-200 cursor-pointer ${
              selectedLang === "en"
                ? "border-[var(--color-primary)] bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed-variant)]"
                : "border-[var(--color-outline-border)] bg-[var(--color-surface-lowest)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary-fixed-dim)]"
            }`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold text-[var(--color-on-surface)]">
                English
              </span>
              <span className="text-sm text-[var(--color-on-surface-variant)] opacity-90">
                Browse in English
              </span>
            </div>
            {selectedLang === "en" && (
              <div className="w-6 h-6 rounded-[var(--radius-full)] bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-on-primary)] shadow-[var(--shadow-level-1)] shrink-0">
                <Check size={16} strokeWidth={2.5} />
              </div>
            )}
          </button>

          {/* Nepali Option */}
          <button
            onClick={() => handleSelect("ne")}
            className={`flex items-center justify-between p-5 rounded-[var(--radius-md)] border-2 text-left font-sans transition-all duration-200 cursor-pointer ${
              selectedLang === "ne"
                ? "border-[var(--color-primary)] bg-[var(--color-primary-fixed)] text-[var(--color-on-primary-fixed-variant)]"
                : "border-[var(--color-outline-border)] bg-[var(--color-surface-lowest)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-primary-fixed-dim)]"
            }`}
          >
            <div className="flex flex-col gap-1">
              <span className="text-lg font-bold text-[var(--color-on-surface)]">
                नेपाली (Nepali)
              </span>
              <span className="text-sm text-[var(--color-on-surface-variant)] opacity-90">
                नेपाली भाषामा ब्राउज गर्नुहोस्
              </span>
            </div>
            {selectedLang === "ne" && (
              <div className="w-6 h-6 rounded-[var(--radius-full)] bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-on-primary)] shadow-[var(--shadow-level-1)] shrink-0">
                <Check size={16} strokeWidth={2.5} />
              </div>
            )}
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={handleProceed}
          className="w-full h-[56px] flex items-center justify-center rounded-[var(--radius-default)] bg-[var(--color-primary)] text-[var(--color-on-primary)] font-sans text-lg font-bold hover:opacity-90 shadow-[var(--shadow-level-1)] active:scale-[0.99] transition-all cursor-pointer mt-2"
        >
          {t("onboarding.proceed")}
        </button>
      </div>
    </div>
  );
}
