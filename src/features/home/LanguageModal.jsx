import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStore } from "../../store/store";

export default function LanguageModal() {
  const { i18n } = useTranslation();
  const { setOnboarded, setLanguage } = useStore();
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const handleContinue = () => {
    const langCode = selectedLanguage === "Nepali" ? "ne" : "en";
    i18n.changeLanguage(langCode);
    setLanguage(langCode);
    setOnboarded(true);
  };

  return (
    <main className="flex items-center justify-center min-h-[75vh] px-4 py-12 bg-[var(--color-background)]">
      {/* Main Card Container */}
      <div
        className="w-full max-w-[540px] bg-[var(--color-surface-lowest)] rounded-md p-10 flex flex-col items-center text-center"
        style={{ boxShadow: "var(--shadow-level-1)" }}
      >
        {/* Logo Icon */}
        <div className="w-16 h-16 rounded-full bg-surface-categories flex items-center justify-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[#1B5E40] flex items-center justify-center flex-shrink-0">
            <svg
              width="22"
              height="19"
              viewBox="0 0 22 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.51288 19C4.06288 19 3.66288 18.8625 3.31288 18.5875C2.96288 18.3125 2.72121 17.9583 2.58788 17.525L0.0378788 8.275C-0.0454545 7.95833 0.00871213 7.66667 0.200379 7.4C0.392045 7.13333 0.654545 7 0.987879 7H5.73788L10.1379 0.45C10.2212 0.316667 10.3379 0.208333 10.4879 0.125C10.6379 0.0416667 10.7962 0 10.9629 0C11.1295 0 11.2879 0.0416667 11.4379 0.125C11.5879 0.208333 11.7045 0.316667 11.7879 0.45L16.1879 7H20.9879C21.3212 7 21.5837 7.13333 21.7754 7.4C21.967 7.66667 22.0212 7.95833 21.9379 8.275L19.3879 17.525C19.2545 17.9583 19.0129 18.3125 18.6629 18.5875C18.3129 18.8625 17.9129 19 17.4629 19H4.51288ZM10.9879 15C11.5379 15 12.0087 14.8042 12.4004 14.4125C12.792 14.0208 12.9879 13.55 12.9879 13C12.9879 12.45 12.792 11.9792 12.4004 11.5875C12.0087 11.1958 11.5379 11 10.9879 11C10.4379 11 9.96704 11.1958 9.57538 11.5875C9.18371 11.9792 8.98788 12.45 8.98788 13C8.98788 13.55 9.18371 14.0208 9.57538 14.4125C9.96704 14.8042 10.4379 15 10.9879 15ZM8.16288 7H13.7879L10.9629 2.8L8.16288 7Z"
                fill="white"
              />
            </svg>
          </div>
        </div>

        {/* Headings */}
        <h1 className="text-[#00452B] leading-[var(--text-headline-lg--line-height)] font-semibold text-[24px] mb-4">
          Welcome to Pathivara Wholesale Supplies
        </h1>

        <p className="text-[#414943] leading-(--text-body-lg--line-height) mb-10 max-w-[400px]">
          Pickup-only wholesale and household/regular ordering website
        </p>

        {/* Language Selection Section */}
        <p className="text-(--text-label-md) font-medium mb-4">
          Select preferred language
        </p>

        <div className="flex gap-4 w-full mb-6">
          {/* English Button */}
          <button
            onClick={() => setSelectedLanguage("English")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[10px] font-semibold text-(--text-body-lg) transition-all ${
              selectedLanguage === "English"
                ? "bg-primary text-(--color-on-primary) border-2 border-primary"
                : "bg-[var(--color-surface-lowest)] text-[var(--color-on-surface)] border-2 border-[var(--color-outline-border)] hover:bg-[var(--color-surface-low)]"
            }`}
          >
            English
            {selectedLanguage === "English" && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8" r="8" fill="white" />
                <path
                  d="M4.5 8.5L7 11L11.5 5.5"
                  stroke="var(--color-primary)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          {/* Nepali Button */}
          <button
            onClick={() => setSelectedLanguage("Nepali")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[10px] font-semibold text-(--text-body-lg) transition-all ${
              selectedLanguage === "Nepali"
                ? "bg-primary text-(--color-on-primary) border-2 border-[var(--color-primary)]"
                : "bg-(--color-surface-lowest) text-(--color-on-surface) border-2 border-[var(--color-outline-border)] hover:bg-[var(--color-surface-low)]"
            }`}
          >
            Nepali
            {selectedLanguage === "Nepali" && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="8" cy="8" r="8" fill="white" />
                <path
                  d="M4.5 8.5L7 11L11.5 5.5"
                  stroke="var(--color-primary)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          className="w-full bg-surface-categories text-primary py-4 rounded-[10px] font-semibold mb-8 hover:bg-[#d5e0d7] transition-colors"
        >
          Continue
        </button>

        {/* Login Link */}
        <p className="text-(--text-label-md) font-medium">
          Already registered?{" "}
          <Link
            to="/login"
            className="font-bold text-[#0052D5] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
