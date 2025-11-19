import axios, { AxiosInstance, AxiosResponse } from "axios";
import { HEADER_KEY, STORAGE_KEY } from "@/utils/constants";

const isBrowser = () => typeof window !== "undefined";

export const getStoredClientIdentifier = (): string | null => {
  if (!isBrowser()) {
    return null;
  }
  return window.sessionStorage.getItem(STORAGE_KEY);
};

export const setStoredClientIdentifier = (identifier: string) => {
  if (!isBrowser()) {
    return;
  }
  window.sessionStorage.setItem(STORAGE_KEY, identifier);
};

const readIdentifierFromResponse = (response: AxiosResponse): string | null => {
  const headers = response?.headers;

  if (!headers) {
    return null;
  }

  if (typeof (headers as any).get === "function") {
    const value = (headers as any).get(HEADER_KEY);
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }

  const headerValue = headers?.[HEADER_KEY];
  return typeof headerValue === "string" && headerValue.length > 0 ? headerValue : null;
};

export const attachClientIdentifierInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use((config) => {
    if (isBrowser()) {
      const identifier = getStoredClientIdentifier();
      if (identifier) {
        if (config.headers && typeof (config.headers as any).set === "function") {
          (config.headers as any).set("X-Client-Identifier", identifier);
        } else {
          config.headers = {
            ...(config.headers || {}),
            "X-Client-Identifier": identifier,
          };
        }
      }
    }

    return config;
  });

  api.interceptors.response.use((response) => {
    if (isBrowser()) {
      const identifier = readIdentifierFromResponse(response);
      if (identifier) {
        setStoredClientIdentifier(identifier);
      }
    }
    return response;
  });
};

attachClientIdentifierInterceptors(axios);