interface LocationData { countryCode: string; currencyInfo: { code: string; symbol: string; rate: number } }

export const getDataFromLocalStorage = (cacheKey: string): LocationData | undefined => {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return undefined;

    try {
        return JSON.parse(cached);
    } catch (error) {
        localStorage.removeItem(cacheKey);
        return undefined;
    }
};

export const setDataInLocalStorage = (
    cacheKey: string,
    data: LocationData
) => {
    localStorage.setItem(cacheKey, JSON.stringify(data));
}

export const clearDataFromLocalStorage = (cacheKey: string) => {
  localStorage.removeItem(cacheKey);
};