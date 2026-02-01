const isBrowser = () => typeof window !== "undefined";

  export const getDataFromLocalStorage = (
    cacheKey: string
  )=> {
    if (!isBrowser()) return undefined;
  
    const localStorageData = window.localStorage.getItem(cacheKey);
    if (!localStorageData) return undefined;
  
    try {
      return JSON.parse(localStorageData);
    } catch {
      window.localStorage.removeItem(cacheKey);
      return undefined;
    }
  };
  
  export const setDataInLocalStorage = (
    cacheKey: string,
    data: object
  ) => {
    if (!isBrowser()) return;
    window.localStorage.setItem(cacheKey, JSON.stringify(data));
  };
  
  export const clearDataFromLocalStorage = (cacheKey: string) => {
    if (!isBrowser()) return;
    window.localStorage.removeItem(cacheKey);
  };
  