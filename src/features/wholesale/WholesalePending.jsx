import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Hourglass, Info, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { apiRequest } from "../../services/api";
import { useHomePath } from "../../hooks/useBackNavigation";

export default function WholesalePending() {
  const { t } = useTranslation();
  const { user: storeUser, token, refreshUser } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const homePath = useHomePath();
  const fromRegistration = Boolean(location.state?.fromRegistration);
  const user = location.state?.user || storeUser;
  const details = user?.wholesaleDetails || {};
  const [whatsApp, setWhatsApp] = useState("");

  useEffect(() => {
    apiRequest("/settings")
      .then((data) => setWhatsApp(data.settings?.contactWhatsApp || ""))
      .catch(() => setWhatsApp(""));
  }, []);

  useEffect(() => {
    if (token) refreshUser();
  }, [token, refreshUser]);

  const handlePrimaryAction = () => {
    if (fromRegistration) {
      navigate("/login", { state: { phone: user?.phone || "" } });
      return;
    }
    navigate(token ? "/homepage" : "/login");
  };

  return (
    <div className="min-h-screen bg-color-surface flex flex-col p-4 sm:p-6 md:p-8">
      <button
        onClick={() => navigate(homePath)}
        className="flex items-center gap-xs text-label-sm font-semibold text-on-surface-variant hover:text-primary mb-6 transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        {t("common.backToHome")}
      </button>
      <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-168 bg-(--color-surface-lowest) rounded-md border border-outline-border shadow-(--shadow-level-2) overflow-hidden">
        <div className="flex flex-col items-center px-6 py-10 sm:px-10 sm:py-10 gap-0">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 rounded-full bg-secondary-fixed flex items-center justify-center">
              <Hourglass
                size={40}
                className="text-(--color-secondary-fixed-variant)"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-[var(--color-primary)] text-center  font-semibold text-headline-md leading-8 mb-4">
            {t("wholesale.pendingTitle")}
          </h1>

          {/* Shop Info */}
          <div className="text-[var(--color-on-surface-variant)]  text-body-md leading-6 text-center mb-4">
            <p>Name: {user?.fullName || "—"}</p>
            <p>Shop Name: {details.shopName || "—"}</p>
            <p>Location: {details.shopLocation || "—"}</p>
            <p>Business Type: {details.businessType || "—"}</p>
            <p>Phone Number: {user?.phone || "—"}</p>
          </div>

          {/* Status Badge */}
          <div className="inline-flex px-4 py-1 rounded-full border border-outline-border-pill mb-2">
            <span className="text-outline-border-pill font-semibold text-[13px] leading-[15.6px] tracking-[0.65px]">
              {t("wholesale.pendingStatus")}
            </span>
          </div>

          {/* Description */}
          <p className="text-on-surface-variant text-body-lg leading-6 mt-2 mb-8">
            {t("wholesale.pendingNote")}
          </p>

          {/* Info Banner */}
          <div className="w-full rounded-default border border-outline-border bg-surface-categories p-4 mb-8">
            <div className="flex items-start gap-3">
              <Info
                size={20}
                className="flex-shrink-0 mt-0.5 text-[var(--color-primary)]"
              />
              <p className="text-[var(--color-on-surface)]  text-body-lg leading-6">
                {t("wholesale.pendingNote2")}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
            <button
              onClick={handlePrimaryAction}
              className="w-full sm:w-[278px] h-[60px] bg-[var(--color-primary-container)] rounded-[10px] shadow-[var(--shadow-level-1)] text-[var(--color-on-primary)]  font-semibold text-lg leading-6 hover:bg-[var(--color-primary)] transition-colors"
            >
              {fromRegistration || !token
                ? t("auth.loginButton")
                : t("wholesale.continueShopping")}
            </button>
            {whatsApp && (
              <a
                href={`https://wa.me/${whatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-[278px] h-[60px] bg-[var(--color-surface-lowest)] rounded-[10px] border border-[var(--color-outline-variant)] text-[var(--color-on-surface-variant)]  font-semibold text-lg leading-6 hover:bg-[var(--color-surface-categories)] transition-colors flex items-center justify-center"
              >
                {t("common.contactWhatsApp")}
              </a>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
