import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken, setToken, clearToken } from "@/lib/auth/token";
import { refreshTokens } from "@/features/auth/apis/refresh";

type QueueEntry = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let isRefreshing = false;
let pendingQueue: QueueEntry[] = [];

const drainQueue = (err: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject }) =>
    err ? reject(err) : resolve(token!),
  );
  pendingQueue = [];
};

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // needed so the browser sends/receives the httpOnly refresh_token cookie
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Don't attempt token refresh for login requests or non-401 errors
    const isLoginRequest = original.url?.includes("/user/login");
    if (error.response?.status !== 401 || original._retry || isLoginRequest) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      }).then((newAccessToken) => {
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosClient(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      // The browser automatically sends the httpOnly refresh_token cookie
      const data = await refreshTokens();
      setToken(data.access_token);
      drainQueue(null, data.access_token);
      original.headers.Authorization = `Bearer ${data.access_token}`;
      return axiosClient(original);
    } catch (refreshError) {
      drainQueue(refreshError, null);
      clearToken();
      if (typeof window !== "undefined") window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosClient;
