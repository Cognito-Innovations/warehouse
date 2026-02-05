import { getSession } from "next-auth/react";
import { getAllCookies, setCookie } from "@/lib/cookieUtils";
import { AUTH_COOKIE_NAME } from "./constants";

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const cookies = getAllCookies();
  return cookies[AUTH_COOKIE_NAME] ?? null;
};

export const getAuthTokenWithFallback = async (): Promise<string | null> => {
  let token = getAuthToken();
  if (token) {
    return token;
  }

  if (typeof window !== "undefined") {
    const session = await getSession();
    const sessionToken = (session as any)?.access_token;

    if (sessionToken) {
      setCookie(AUTH_COOKIE_NAME, sessionToken, {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return sessionToken;
    }
  }

  return null;
};
