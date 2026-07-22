import React from "react";
import { useStore } from "../../store/store";

export default function NotificationPrompt() {
  const { user, notificationsEnabled, setNotificationsEnabled } = useStore();

  // Only show if user is logged in and hasn't made a choice yet
  if (!user || notificationsEnabled !== "pending") return null;

  const handleAccept = () => {
    setNotificationsEnabled("granted");
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission !== "granted"
    ) {
      Notification.requestPermission();
    }
  };

  const handleDecline = () => {
    setNotificationsEnabled("denied");
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
          Allow pathivara for send you notifcaton!
        </h2>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 w-full">
          {/* Allow Button */}
          <button
            onClick={handleAccept}
            className="flex-1 py-3 px-6 bg-primary text-(--color-on-primary) rounded-[10px] font-semibold hover:bg-[var(--color-primary-container)] active:scale-[0.98] transition-all duration-150 cursor-pointer shadow-sm"
          >
            Allow
          </button>

          {/* Deny Button */}
          <button
            onClick={handleDecline}
            className="flex-1 py-3 px-6 bg-(--color-surface-lowest) text-(--color-on-surface) border border-[var(--color-outline-variant)] rounded-[10px] font-semibold hover:bg-[var(--color-surface-low)] active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  );
}
