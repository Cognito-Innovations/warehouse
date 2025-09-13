/**
 * Cookie utility functions for secure authentication
 */

interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

/**
 * Set a cookie with the given name, value, and options
 */
export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
  const {
    expires,
    maxAge,
    path = '/',
    domain,
    secure = window.location.protocol === 'https:',
    sameSite = 'lax',
    httpOnly = false
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
    cookieString += `; secure`;
  }

  if (sameSite) {
    cookieString += `; samesite=${sameSite}`;
  }

  if (httpOnly) {
    cookieString += `; httponly`;
  }

  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  const nameEQ = `${encodeURIComponent(name)}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    let c = cookie.trim();
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length));
    }
  }
  return null;
};

/**
 * Remove a cookie by setting its expiration date to the past
 */
export const removeCookie = (name: string, path: string = '/', domain?: string): void => {
  setCookie(name, '', {
    expires: new Date(0),
    path,
    domain,
    secure: window.location.protocol === 'https:',
    sameSite: 'lax'
  });
};

/**
 * Check if a cookie exists
 */
export const hasCookie = (name: string): boolean => {
  return getCookie(name) !== null;
};

/**
 * Get all cookies as an object
 */
export const getAllCookies = (): Record<string, string> => {
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

/**
 * Clear all cookies (useful for logout)
 */
export const clearAllCookies = (): void => {
  const cookies = getAllCookies();
  Object.keys(cookies).forEach(cookieName => {
    removeCookie(cookieName);
  });
};
