import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useStore } from "../../store/store";

export default function NotificationPrompt() {
  const { t } = useTranslation();
  const {
    user,
    notificationsEnabled,
    setNotificationsEnabled,
    notificationPromptOpen,
    closeNotificationPrompt,
  } = useStore();

  if (!user || notificationsEnabled !== "pending" || !notificationPromptOpen)
    return null;

  const handleAccept = async () => {
    setNotificationsEnabled("granted");
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission !== "granted"
    ) {
      const outcome = await Notification.requestPermission();
      if (outcome === "granted") {
        toast.success(t("notifyPrompt.enabled"));
        return;
      }
      toast.info(t("notifyPrompt.fallback"));
      return;
    }
    toast.success(t("notifyPrompt.enabled"));
  };

  const handleDecline = () => {
    setNotificationsEnabled("denied");
    closeNotificationPrompt();
    toast.info(t("notifyPrompt.declined"));
  };

  return (
    /* Modal Backdrop */
    <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
      {/* Notification Card Container */}
      <div
        className="w-full max-w-[460px] bg-[var(--color-surface)] rounded-[var(--radius-xl)] p-8 md:p-10 flex flex-col items-center text-center"
        style={{ boxShadow: "var(--shadow-level-2)" }}
      >
        {/* Modal Title */}
        <h2 className="text-[var(--text-headline-sm)] md:text-[22px] font-bold text-[var(--color-on-surface)] tracking-tight leading-snug mb-8">
          {t("notifyPrompt.title")}
        </h2>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 w-full">
          {/* Allow Button */}
          <button
            onClick={handleAccept}
            className="flex-1 py-3 px-6 bg-primary text-(--color-on-primary) rounded-[10px] font-semibold hover:bg-[var(--color-primary-container)] active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-sm"
          >
            {t("notifyPrompt.allow")}
          </button>

          {/* Deny Button */}
          <button
            onClick={handleDecline}
            className="flex-1 py-3 px-6 bg-(--color-surface-lowest) text-(--color-on-surface) border border-[var(--color-outline-variant)] rounded-[10px] font-semibold hover:bg-[var(--color-surface-low)] active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            {t("notifyPrompt.deny")}
          </button>
        </div>
      </div>
    </div>
  );
}
