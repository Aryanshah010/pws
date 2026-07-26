import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { useStore } from "../../store/store";

const ROLE_LABELS = {
  "household/individual": "HOUSEHOLD / REGULAR BUYER",
  "bulk/shop": "SHOP / BULK BUYER",
  pending_wholesale: "WHOLESALE REQUEST PENDING",
  verified_wholesale: "VERIFIED WHOLESALE BUYER",
  admin: "STOREKEEPER",
};

export default function AccountActive() {
  const { t } = useTranslation();
  const { user } = useStore();
  const navigate = useNavigate();
  return (
    <main
      className="flex flex-col items-center justify-center flex-1 w-full min-h-[75vh] px-(--spacing-md) py-(--spacing-2xl)"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      {/* Central Confirmation Card */}
      <div
        className="justify-center w-full max-w-135 flex flex-col items-center text-center"
        style={{
          backgroundColor: "var(--color-surface-lowest)",
          borderRadius: "var(--radius-md)",
          boxShadow: "var(--shadow-level-2)",
          padding: "40px var(--spacing-2xl)",
        }}
      >
        {/* Success Icon Badge */}
        <div
          className="flex items-center justify-center rounded-full transition-transform duration-[var(--duration-medium)] hover:scale-105"
          style={{
            width: "48px",
            height: "48px",
            backgroundColor: "var(--color-surface-categories)",
          }}
        >
          <Check
            size={24}
            strokeWidth={3}
            style={{ color: "var(--color-primary)" }}
          />
        </div>

        {/* Header Title */}
        <h1
          className="font-sans"
          style={{
            fontSize: "var(--text-headline-md)",
            lineHeight: "var(--text-headline-lg--line-height)",
            fontWeight: "600",
            color: "var(--color-on-surface)",
            marginTop: "var(--spacing-lg)",
          }}
        >
          {t("auth.accountActive")}
        </h1>

        {/* User Account Details */}
        <div
          className="font-sans flex flex-col gap-1"
          style={{
            fontSize: "var(--text-body-md)",
            lineHeight: "var(--text-body-md--line-height)",
            fontWeight: "var(--text-body-md--font-weight)",
            color: "var(--color-on-surface-variant)",
            marginTop: "var(--spacing-sm)",
          }}
        >
          <p>Name: {user?.fullName || "—"}</p>
          <p>Phone Number: {user?.phone || "—"}</p>
        </div>

        {/* Account Classification Pill */}
        <div
          className="font-sans inline-flex items-center justify-center font-bold tracking-wide"
          style={{
            fontSize: "var(--text-label-sm)",
            lineHeight: "var(--text-label-sm--line-height)",
            color: "var(--color-primary)",
            backgroundColor: "var(--color-surface-categories)",
            padding: "6px var(--spacing-md)",
            borderRadius: "var(--radius-full)",
            marginTop: "var(--spacing-sm)",
          }}
        >
          {ROLE_LABELS[user?.role] || ROLE_LABELS["household/individual"]}
        </div>

        {/* Informational Description */}
        <p
          className="font-sans max-w-[400px]"
          style={{
            fontSize: "var(--text-body-md)",
            lineHeight: "var(--text-body-md--line-height)",
            fontWeight: "var(--text-body-md--font-weight)",
            color: "var(--color-on-surface-variant)",
            marginTop: "var(--spacing-xl)",
          }}
        >
          {t("auth.accountActiveNote")}
        </p>

        {/* Action Button Group */}
        <div
          className="w-full flex flex-col sm:flex-row items-center justify-center gap-(--spacing-md)"
          style={{ marginTop: "var(--spacing-xl)" }}
        >
          {/* Primary Action Button */}
          <button
            type="button"
            className="w-50.5 sm:w-auto min-w-42.5 font-sans font-semibold cursor-pointer text-center border border-transparent transition-colors"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-on-primary)",
              fontSize: "var(--text-label-md)",
              lineHeight: "var(--text-label-md--line-height)",
              padding: "12px var(--spacing-lg)",
              borderRadius: "10px",
              transitionDuration: "var(--duration-short)",
              transitionTimingFunction: "var(--ease-standard)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-primary-container)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-primary)")
            }
            onClick={() => navigate("/homepage")}
          >
            {t("auth.goToHome")}
          </button>

          {/* Secondary Action Button */}
          <button
            type="button"
            className="w-50.5 sm:w-auto min-w-42.5 font-sans font-semibold cursor-pointer text-center bg-transparent transition-colors"
            style={{
              border: "1px solid var(--color-outline-variant)",
              color: "var(--color-on-surface)",
              fontSize: "var(--text-label-md)",
              lineHeight: "var(--text-label-md--line-height)",
              padding: "12px var(--spacing-lg)",
              borderRadius: "var(--radius-default)",
              transitionDuration: "var(--duration-short)",
              transitionTimingFunction: "var(--ease-standard)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-surface-low)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() => navigate("/profile")}
          >
            {t("auth.completeProfile")}
          </button>
        </div>
      </div>
    </main>
  );
}
