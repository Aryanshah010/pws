import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

/**
 * Where "home" is for whoever is looking at the screen.
 *
 * There are three different home screens in this app and a back arrow that
 * hardcodes one of them is wrong for two thirds of buyers: a signed-out visitor
 * sent to /homepage lands inside the shop with no session, and a signed-in
 * buyer sent to / is bounced by the guest guard.
 */
export function useHomePath() {
  const token = useStore((state) => state.token);
  const role = useStore((state) => state.user?.role);
  if (!token) return "/";
  return role === "admin" ? "/admin" : "/homepage";
}

/**
 * A back arrow that goes back where the buyer came from, and lands somewhere
 * sensible when there is nowhere to go back to.
 *
 * navigate(-1) on its own is unsafe: opened from a link, a refresh or a new
 * tab there is no previous entry in this app's history, so it walks out of the
 * app entirely or replays a page whose state has since been cleared. React
 * Router stamps an index onto each history entry it owns, so index 0 means this
 * page is where the session started and the fallback is used instead.
 */
export function useGoBack(fallback) {
  const navigate = useNavigate();
  const homePath = useHomePath();
  const target = fallback || homePath;

  return useCallback(() => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(target, { replace: true });
  }, [navigate, target]);
}
