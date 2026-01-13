export const getCachedLocation = (
    cacheKey: string
): { countryCode: string; currencyInfo: { code: string; symbol: string; rate: number } } | undefined => {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return undefined;

    try {
        return JSON.parse(cached);
    } catch (error) {
        localStorage.removeItem(cacheKey);
        return undefined;
    }
};

export const setCachedLocation = (
    cacheKey: string,
    data: { countryCode: string; currencyInfo: { code: string; symbol: string; rate: number } }
) => {
    localStorage.setItem(cacheKey, JSON.stringify(data));
}

export const clearCachedLocation = (cacheKey: string) => {
  localStorage.removeItem(cacheKey);
};