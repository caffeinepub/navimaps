import { createActor } from "@/backend";
import type { Coordinate, NavigationStep, Route, TurnDirection } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useState } from "react";

interface OsrmStep {
  maneuver: {
    type: string;
    modifier?: string;
    location: [number, number];
  };
  name: string;
  distance: number;
  duration: number;
}

interface OsrmLeg {
  steps: OsrmStep[];
  distance: number;
  duration: number;
}

interface OsrmRoute {
  legs: OsrmLeg[];
  distance: number;
  duration: number;
  geometry: {
    coordinates: [number, number][];
  };
}

interface OsrmResponse {
  code: string;
  routes: OsrmRoute[];
}

interface BackendWithRouting {
  calculateRoute: (
    fromLon: number,
    fromLat: number,
    toLon: number,
    toLat: number,
  ) => Promise<string>;
}

export interface RoutingState {
  route: Route | null;
  loading: boolean;
  error: string | null;
}

function mapManeuverToDirection(
  type: string,
  modifier?: string,
): TurnDirection {
  if (type === "arrive") return "bestemming";
  if (type === "depart") return "start";
  if (type === "roundabout" || type === "rotary") return "rotonde";
  if (
    type === "on ramp" ||
    type === "off ramp" ||
    (modifier === "straight" && type === "merge")
  )
    return "snelweg";
  if (modifier === "right" || modifier === "sharp right") return "rechtsaf";
  if (modifier === "left" || modifier === "sharp left") return "linksaf";
  return "rechtdoor";
}

function buildDutchInstruction(step: OsrmStep): string {
  const { type, modifier } = step.maneuver;
  const street = step.name ? ` op ${step.name}` : "";
  const dist =
    step.distance >= 1000
      ? `${(step.distance / 1000).toFixed(1)} km`
      : `${Math.round(step.distance)} m`;

  if (type === "depart") return `Vertrek${street}`;
  if (type === "arrive")
    return `U bent gearriveerd${street ? ` op ${step.name}` : " op uw bestemming"}`;
  if (type === "roundabout" || type === "rotary")
    return `Neem de rotonde${street}`;
  if (modifier === "right" || modifier === "sharp right")
    return `Sla rechtsaf${street} over ${dist}`;
  if (modifier === "left" || modifier === "sharp left")
    return `Sla linksaf${street} over ${dist}`;
  if (modifier === "straight") return `Ga rechtdoor${street} voor ${dist}`;
  if (type === "merge") return `Voeg samen${street}`;
  if (type === "on ramp") return `Neem de oprit${street}`;
  if (type === "off ramp") return `Verlaat de snelweg${street}`;
  return `Ga verder${street} voor ${dist}`;
}

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours} u ${remaining} min` : `${hours} u`;
}

function estimatedArrival(seconds: number): string {
  const now = new Date();
  now.setSeconds(now.getSeconds() + seconds);
  return now.toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function useRouting() {
  const { actor, isFetching } = useActor(createActor);
  const [state, setState] = useState<RoutingState>({
    route: null,
    loading: false,
    error: null,
  });

  const calculateRoute = useCallback(
    async (
      origin: {
        place: { id: string; name: string; address: string };
        coord: Coordinate;
      },
      destination: {
        place: { id: string; name: string; address: string };
        coord: Coordinate;
      },
    ): Promise<Route | null> => {
      if (!actor || isFetching) {
        setState({
          route: null,
          loading: false,
          error: "Verbinding met server niet beschikbaar.",
        });
        return null;
      }

      setState({ route: null, loading: true, error: null });

      try {
        const backend = actor as unknown as BackendWithRouting;
        const jsonStr = await backend.calculateRoute(
          origin.coord.lng,
          origin.coord.lat,
          destination.coord.lng,
          destination.coord.lat,
        );

        const data = JSON.parse(jsonStr) as OsrmResponse;

        if (data.code !== "Ok" || !data.routes.length) {
          setState({
            route: null,
            loading: false,
            error: "Route niet gevonden. Probeer een andere bestemming.",
          });
          return null;
        }

        const osrmRoute = data.routes[0];
        const leg = osrmRoute.legs[0];

        const steps: NavigationStep[] = (leg?.steps ?? []).map((step, i) => ({
          id: `step-${i}`,
          instruction: buildDutchInstruction(step),
          distance: formatDistance(step.distance),
          direction: mapManeuverToDirection(
            step.maneuver.type,
            step.maneuver.modifier,
          ),
          streetName: step.name || undefined,
        }));

        const polyline: Coordinate[] = osrmRoute.geometry.coordinates.map(
          ([lng, lat]) => ({ lat, lng }),
        );

        const route: Route = {
          id: `route-${Date.now()}`,
          origin: {
            id: origin.place.id,
            name: origin.place.name,
            address: origin.place.address,
            coordinate: origin.coord,
          },
          destination: {
            id: destination.place.id,
            name: destination.place.name,
            address: destination.place.address,
            coordinate: destination.coord,
          },
          totalDistance: formatDistance(osrmRoute.distance),
          totalDuration: formatDuration(osrmRoute.duration),
          estimatedArrival: estimatedArrival(osrmRoute.duration),
          steps,
          polyline,
        };

        setState({ route, loading: false, error: null });
        return route;
      } catch {
        const errorMsg =
          "Route niet gevonden. Controleer uw internetverbinding.";
        setState({ route: null, loading: false, error: errorMsg });
        return null;
      }
    },
    [actor, isFetching],
  );

  const clearRoute = useCallback(() => {
    setState({ route: null, loading: false, error: null });
  }, []);

  return { ...state, calculateRoute, clearRoute };
}
