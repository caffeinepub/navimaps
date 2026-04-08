import type { GeolocationState } from "@/types";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_AMSTERDAM: GeolocationState = {
  coordinate: { lat: 52.3676, lng: 4.9041 },
  accuracy: null,
  error: null,
  loading: false,
  permissionDenied: false,
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    coordinate: null,
    accuracy: null,
    error: null,
    loading: false,
    permissionDenied: false,
  });
  const [dismissed, setDismissed] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        ...DEFAULT_AMSTERDAM,
        error: "Geolocatie wordt niet ondersteund door uw browser.",
      });
      return;
    }

    setDismissed(false);
    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinate: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          accuracy: position.coords.accuracy,
          error: null,
          loading: false,
          permissionDenied: false,
        });
      },
      (err) => {
        const permissionDenied = err.code === err.PERMISSION_DENIED;
        setState({
          ...DEFAULT_AMSTERDAM,
          error: permissionDenied
            ? "Locatietoegang is uitgeschakeld."
            : "Kon uw locatie niet bepalen. De kaart toont Amsterdam als standaard locatie.",
          loading: false,
          permissionDenied,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    );
  }, []);

  const dismissBanner = useCallback(() => {
    setDismissed(true);
  }, []);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  return { ...state, requestLocation, dismissed, dismissBanner };
}
