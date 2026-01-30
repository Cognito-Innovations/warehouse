import { getStoredUser } from "./auth.service";

export const getCountryFilterParams = () => {
  const stored = getStoredUser();

  const role = stored?.user?.role;
  const countryId =
    stored?.user?.preference?.courier?.country?.id;

  if (role === 'super_admin') {
    return {};
  }

  if (role === 'admin' && countryId) {
    return { country_id: countryId };
  }

  return {};
};