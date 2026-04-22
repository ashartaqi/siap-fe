import { AUTH_COOKIE } from "./constants";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${AUTH_COOKIE}=([^;]*)`),
  );
  if (match) return decodeURIComponent(match[1]);
  // fallback for sessions created before cookie-based storage
  return localStorage.getItem("token");
};

export const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=strict${location.protocol === "https:" ? "; secure" : ""}`;
};

export const clearToken = () => {
  if (typeof window === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
};
