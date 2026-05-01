import { AUTH_COOKIE } from "./constants";

const cookieSecure =
  typeof location !== "undefined" && location.protocol === "https:"
    ? "; secure"
    : "";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${AUTH_COOKIE}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
};

export const setToken = (token: string) => {
  if (typeof window === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${60 * 15}; samesite=strict${cookieSecure}`;
};

export const clearToken = () => {
  if (typeof window === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
};
