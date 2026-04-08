export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  coordinate: Coordinate;
}

export type TurnDirection =
  | "rechtsaf"
  | "linksaf"
  | "rechtdoor"
  | "rotonde"
  | "snelweg"
  | "bestemming"
  | "start";

export interface NavigationStep {
  id: string;
  instruction: string;
  distance: string;
  direction: TurnDirection;
  streetName?: string;
}

export interface Route {
  id: string;
  origin: Place;
  destination: Place;
  totalDistance: string;
  totalDuration: string;
  estimatedArrival: string;
  steps: NavigationStep[];
  polyline: Coordinate[];
}

export type MapLayer = "standaard" | "satelliet" | "verkeer";

export interface MapState {
  center: Coordinate;
  zoom: number;
  layer: MapLayer;
  selectedRoute: Route | null;
  activeStepIndex: number;
}

export interface GeolocationState {
  coordinate: Coordinate | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
  permissionDenied: boolean;
}
