import { useEffect, useRef } from "react";

import { useLocationStore } from "@/store/locationStore";
import { clearDataFromLocalStorage } from "@/utils/localStorageUtils";
import { GUEST_LOCATION_STORAGE_KEY } from "@/utils/constants";

export const useLocationSync = (isAuthenticated: boolean, userId?: string) => {
  const { loadLocation, refreshLocation } = useLocationStore();
  const isMounted = useRef(false);

  const syncLocation = async () => {
    if (isAuthenticated && userId) {
      clearDataFromLocalStorage(GUEST_LOCATION_STORAGE_KEY);
      await refreshLocation(userId);
    } else if (!isAuthenticated) {
      await loadLocation();
    }
  };

  useEffect(() => {
    syncLocation();
    isMounted.current = true;
  }, [isAuthenticated, userId, loadLocation, refreshLocation]);
};