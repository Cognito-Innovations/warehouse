import { AUTH_COOKIE_NAME } from "../utils/constants";

interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}


export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  if (typeof window === "undefined") {
    return;
  }

  const {
    expires,
    maxAge,
    path = '/',
    domain,
    secure = process.env.NODE_ENV === 'production',
    sameSite = 'lax',
  } = options;

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`;
  }

  if (path) {
    cookieString += `; path=${path}`;
  }

  if (domain) {
    cookieString += `; domain=${domain}`;
  }

  if (secure) {
    cookieString += `; Secure`;
  }

  if (sameSite) {
    cookieString += `; SameSite=${sameSite}`;
  }

  document.cookie = cookieString;
};

export const removeCookie = (name: string, path: string = '/', domain?: string): void => {
  setCookie(name, '', {
    expires: new Date(0),
    path,
    domain,
    secure: window.location.protocol === 'https:',
    sameSite: 'lax'
  });
};

export const clearAuthTokenCookie = (): void => {
  removeCookie(AUTH_COOKIE_NAME);
};

export const getAllCookies = (): Record<string, string> => {
  if (typeof window === "undefined") {
    return {};
  }

  const cookies: Record<string, string> = {};
  const cookieArray = document.cookie.split(';');

  for (let cookie of cookieArray) {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value);
    }
  }

  return cookies;
};

export const clearAllCookies = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  const cookies = getAllCookies();
  Object.keys(cookies).forEach(cookieName => {
    removeCookie(cookieName);
  });
};

export function clearBrowserStorage(): void {
  // Clear Local Storage
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.clear();
  }

  // Clear Session Storage
  if (typeof window !== "undefined" && window.sessionStorage) {
    sessionStorage.clear();
  }

  // Clear Cookies
  if (typeof document !== "undefined") {
    document.cookie.split(";").forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();

      // Remove cookie for current path
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

      // Also try removing for current domain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
    });
  }
}
