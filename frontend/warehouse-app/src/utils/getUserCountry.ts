interface UserCountry {
  countryCode?: string;
  countryName?: string;
}

export async function getUserCountryByIP(): Promise<UserCountry> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) return { countryCode: undefined, countryName: undefined };
    const data = await res.json();
    return { countryCode: data.country_code, countryName: data.country_name };
  } catch (e) {
    return { countryCode: undefined, countryName: undefined };
  }
}