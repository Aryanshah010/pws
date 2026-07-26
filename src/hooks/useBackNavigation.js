import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";


export function useHomePath() {
  const token = useStore((state) => state.token);
  const role = useStore((state) => state.user?.role);
  if (!token) return "/";
  return role === "admin" ? "/admin" : "/homepage";
}

export function useGoBack(fallback) {
  const navigate = useNavigate();
  const homePath = useHomePath();
  const target = fallback || homePath;

  return useCallback(() => {
    if (window.history.state?.idx > 0) navigate(-1);
    else navigate(target, { replace: true });
  }, [navigate, target]);
}
