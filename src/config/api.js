import axios from "axios";
import { getToken, clearToken } from "../utils/token";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://route-posts.routemisr.com";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});


http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});


let onUnauthorized = null;
export function registerUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const payload = error.response?.data;
    if (status === 401 || status === 403) {
      clearToken();
      if (onUnauthorized) onUnauthorized();
    }

    const message =
      payload?.message ||
      (Array.isArray(payload?.errors) ? payload.errors.join(", ") : null) ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject({
      status,
      message,
      errors: payload?.errors || [],
      raw: error,
    });
  }
);

export function unwrap(response) {
  return response.data?.data;
}

export function unwrapWithMeta(response) {
  return { data: response.data?.data, meta: response.data?.meta };
}


export function unwrapItem(response, key) {
  const data = response.data?.data;
  if (data && typeof data === "object" && !Array.isArray(data)) {
    if (data[key] && typeof data[key] === "object") return data[key];
    
    if (data.data && typeof data.data === "object") return data.data;
  }
  return data;
}
