import type { Coordinate, MapLayer, MapState, Route } from "@/types";
import { useCallback, useState } from "react";

const DEFAULT_CENTER: Coordinate = { lat: 52.3676, lng: 4.9041 };

export function useMap(initialCenter?: Coordinate) {
  const [state, setState] = useState<MapState>({
    center: initialCenter ?? DEFAULT_CENTER,
    zoom: 13,
    layer: "standaard",
    selectedRoute: null,
    activeStepIndex: 0,
  });

  const setCenter = useCallback((center: Coordinate) => {
    setState((prev) => ({ ...prev, center }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState((prev) => ({ ...prev, zoom: Math.min(18, Math.max(3, zoom)) }));
  }, []);

  const zoomIn = useCallback(() => {
    setState((prev) => ({ ...prev, zoom: Math.min(18, prev.zoom + 1) }));
  }, []);

  const zoomOut = useCallback(() => {
    setState((prev) => ({ ...prev, zoom: Math.max(3, prev.zoom - 1) }));
  }, []);

  const setLayer = useCallback((layer: MapLayer) => {
    setState((prev) => ({ ...prev, layer }));
  }, []);

  const selectRoute = useCallback((route: Route | null) => {
    setState((prev) => ({
      ...prev,
      selectedRoute: route,
      activeStepIndex: 0,
      center: route ? route.origin.coordinate : prev.center,
    }));
  }, []);

  const setActiveStep = useCallback((index: number) => {
    setState((prev) => {
      const steps = prev.selectedRoute?.steps ?? [];
      const clamped = Math.max(0, Math.min(steps.length - 1, index));
      return { ...prev, activeStepIndex: clamped };
    });
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      const steps = prev.selectedRoute?.steps ?? [];
      const next = Math.min(steps.length - 1, prev.activeStepIndex + 1);
      return { ...prev, activeStepIndex: next };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeStepIndex: Math.max(0, prev.activeStepIndex - 1),
    }));
  }, []);

  return {
    ...state,
    setCenter,
    setZoom,
    zoomIn,
    zoomOut,
    setLayer,
    selectRoute,
    setActiveStep,
    nextStep,
    prevStep,
  };
}
