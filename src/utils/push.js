export function showPush(push) {
  if (!push?.title) return;
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (document.visibilityState === "visible" && document.hasFocus()) return;

  try {
    new Notification(push.title, {
      body: push.body || "",
      icon: "/favicon.svg",
      tag: push.tag || push.title,
    });
  } catch {
    console.log("Notification error");
  }
}
