import React from "react";
import { useStore } from "../../store/store";
import { Bell, X } from "lucide-react";

export default function NotificationPrompt() {
  const { user, notificationsEnabled, setNotificationsEnabled } = useStore();

  // Only show if user is logged in and hasn't made a choice yet
  if (!user || notificationsEnabled !== "pending") return null;

  const handleAccept = () => {
    setNotificationsEnabled("granted");
    // In a real app, this would call Notification.requestPermission()
    if (window.Notification && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  const handleDecline = () => {
    setNotificationsEnabled("denied");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-[var(--color-surface-lowest)] border border-[var(--color-outline-variant)] shadow-[var(--shadow-level-3)] rounded-[12px] p-5 overflow-hidden animate-in slide-in-from-bottom-5">
      <div className="flex gap-4 items-start">
        <div className="w-10 h-10 rounded-full bg-[#F4FBF4] flex items-center justify-center shrink-0">
          <Bell className="text-[var(--color-primary-container)]" size={20} />
        </div>

        <div className="flex-1">
          <h4 className="text-base font-bold text-[var(--color-on-surface)]">
            Enable Notifications
          </h4>
          <p className="text-sm text-[var(--color-on-surface-variant)] mt-1 mb-4 leading-relaxed">
            Get instant SMS and push alerts for your order status and wholesale
            verification updates.
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 py-2 px-4 bg-[var(--color-primary-container)] hover:bg-[#164f35] text-white text-sm font-semibold rounded-[8px] transition-colors"
            >
              Allow
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 py-2 px-4 bg-transparent border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-low)] text-[var(--color-on-surface-variant)] text-sm font-semibold rounded-[8px] transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>

        <button
          onClick={handleDecline}
          className="text-[var(--color-outline)] hover:text-[var(--color-on-surface)] transition-colors absolute top-4 right-4"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
