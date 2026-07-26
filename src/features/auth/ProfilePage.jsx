import React from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "../../store/store";
import { ArrowLeft } from "lucide-react";
import { useGoBack } from "../../hooks/useBackNavigation";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useStore();
  const goBack = useGoBack();

  if (!user) {
    return (
      <div className="p-8 text-center text-on-surface-variant">
        {t("auth.loginFirst")}
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto w-full px-4 py-8 font-sans">
      <button
        onClick={goBack}
        aria-label={t("common.goBack")}
        className="p-2 hover:bg-surface-dim rounded-full transition-colors text-(--color-on-surface) mb-2"
      >
        <ArrowLeft size={24} />
      </button>
      <h1 className="text-[32px] font-bold text-[#00452B] mb-6">
        {t("auth.myProfile")}
      </h1>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-[#C1C8C1]">
        <div className="flex justify-between items-center mb-6 border-b border-[#C1C8C1] pb-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#00452B]">
              {user.fullName}
            </h2>
            <p className="text-[#414943] mt-2">{user.phone}</p>
          </div>

          <div>
            {user.role === "pending_wholesale" && (
              <div className="bg-yellow-100 text-yellow-800 px-4 py-1.5 rounded-full text-sm font-semibold border border-yellow-200 shadow-sm">
                {t("auth.wholesalePending")}
              </div>
            )}
            {user.role === "verified_wholesale" && (
              <div className="bg-[#F4FBF4] text-[#1B5E40] px-4 py-1.5 rounded-full text-sm font-semibold border border-[#1B5E40]/30 shadow-sm">
                {t("auth.verifiedWholesale")}
              </div>
            )}
            {user.role === "household/individual" && (
              <div className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-full text-sm font-semibold border border-gray-200 shadow-sm">
                {t("auth.householdBuyer")}
              </div>
            )}
            {user.role === "bulk/shop" && (
              <div className="bg-gray-100 text-gray-800 px-4 py-1.5 rounded-full text-sm font-semibold border border-gray-200 shadow-sm">
                {t("auth.shopBuyer")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
