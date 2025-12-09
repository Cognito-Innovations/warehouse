import { getSession } from "next-auth/react";

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const name = "auth-token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
};

export const getAuthTokenWithFallback = async (): Promise<string | null> => {
  let token = getAuthToken();

  if (!token && typeof window !== "undefined") {
    const session = await getSession();
    token = session?.access_token || null;
    if (token) {
      document.cookie = `auth-token=${token}; path=/; SameSite=Lax`;
    }
  }

  return token;
};