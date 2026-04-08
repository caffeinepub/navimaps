import { createActor } from "@/backend";
import type { Coordinate, Place } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useState } from "react";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    city?: string;
    town?: string;
    village?: string;
    country?: string;
  };
}

export interface GeocodingState {
  results: Place[];
  loading: boolean;
  error: string | null;
  noResults: boolean;
}

/** Format a Nominatim display_name into a readable "Name, City, Country" label */
function formatAddress(displayName: string): string {
  const parts = displayName.split(",").map((p) => p.trim());
  if (parts.length <= 2) return displayName;
  const tail = parts.slice(-2).join(", ");
  const head = parts[0] ?? "";
  if (head === tail) return head;
  return `${head}, ${tail}`;
}

/** Direct Nominatim fallback — used when the backend actor is unavailable */
async function nominatimSearch(query: string): Promise<NominatimResult[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1`;
  console.log("[useGeocoding] Falling back to direct Nominatim:", url);
  const res = await fetch(url, {
    headers: { "Accept-Language": "nl", "User-Agent": "NaviMaps/1.0" },
  });
  if (!res.ok) throw new Error(`Nominatim status ${res.status}`);
  return res.json() as Promise<NominatimResult[]>;
}

function parseNominatimResults(data: NominatimResult[]): Place[] {
  return data.map((item) => ({
    id: String(item.place_id),
    name: item.display_name.split(",")[0]?.trim() ?? item.display_name,
    address: formatAddress(item.display_name),
    coordinate: {
      lat: Number.parseFloat(item.lat),
      lng: Number.parseFloat(item.lon),
    },
  }));
}

export function useGeocoding() {
  const { actor, isFetching } = useActor(createActor);
  const [state, setState] = useState<GeocodingState>({
    results: [],
    loading: false,
    error: null,
    noResults: false,
  });

  const geocode = useCallback(
    async (query: string): Promise<Place[]> => {
      const trimmed = query.trim();
      if (trimmed.length < 2) {
        setState({
          results: [],
          loading: false,
          error: null,
          noResults: false,
        });
        return [];
      }

      setState({ results: [], loading: true, error: null, noResults: false });

      // Try backend actor first, fall back to direct Nominatim if unavailable
      const actorReady = actor && !isFetching;
      console.log(
        `[useGeocoding] geocode("${trimmed}") — actor ready: ${actorReady}, isFetching: ${isFetching}`,
      );

      try {
        let data: NominatimResult[];

        if (actorReady) {
          console.log("[useGeocoding] Calling backend.geocodeAddress…");
          try {
            // The actor is typed as unknown in useActor — cast through backendInterface
            const jsonStr = await (
              actor as { geocodeAddress: (q: string) => Promise<string> }
            ).geocodeAddress(trimmed);
            console.log("[useGeocoding] Backend response received, parsing…");
            const parsed = JSON.parse(jsonStr) as
              | NominatimResult[]
              | { error?: string };
            if (!Array.isArray(parsed)) {
              console.warn(
                "[useGeocoding] Backend returned non-array:",
                parsed,
              );
              // fall through to direct nominatim
              data = await nominatimSearch(trimmed);
            } else {
              data = parsed;
            }
          } catch (backendErr) {
            console.warn(
              "[useGeocoding] Backend call failed, using fallback:",
              backendErr,
            );
            data = await nominatimSearch(trimmed);
          }
        } else {
          data = await nominatimSearch(trimmed);
        }

        if (!Array.isArray(data) || data.length === 0) {
          setState({
            results: [],
            loading: false,
            error: null,
            noResults: true,
          });
          return [];
        }

        const places = parseNominatimResults(data);
        console.log(`[useGeocoding] ${places.length} resultaten gevonden`);
        setState({
          results: places,
          loading: false,
          error: null,
          noResults: false,
        });
        return places;
      } catch (err) {
        console.error("[useGeocoding] Alle zoekmethoden mislukt:", err);
        setState({
          results: [],
          loading: false,
          error: "Zoeken tijdelijk niet beschikbaar.",
          noResults: false,
        });
        return [];
      }
    },
    [actor, isFetching],
  );

  const reverseGeocode = useCallback(
    async (coord: Coordinate): Promise<Place | null> => {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${coord.lat}&lon=${coord.lng}&format=json`;
        const res = await fetch(url, {
          headers: { "Accept-Language": "nl", "User-Agent": "NaviMaps/1.0" },
        });
        if (!res.ok) return null;
        const item = (await res.json()) as NominatimResult;
        if (!item?.place_id) return null;
        return {
          id: String(item.place_id),
          name: item.display_name.split(",")[0]?.trim() ?? "Huidige locatie",
          address: formatAddress(item.display_name),
          coordinate: coord,
        };
      } catch {
        // Also try via actor if direct fetch fails
        if (!actor || isFetching) return null;
        try {
          const jsonStr = await (
            actor as { geocodeAddress: (q: string) => Promise<string> }
          ).geocodeAddress(`${coord.lat},${coord.lng}`);
          const data = JSON.parse(jsonStr) as
            | NominatimResult[]
            | NominatimResult;
          const item: NominatimResult | undefined = Array.isArray(data)
            ? data[0]
            : data;
          if (!item) return null;
          return {
            id: String(item.place_id),
            name: item.display_name.split(",")[0]?.trim() ?? "Huidige locatie",
            address: formatAddress(item.display_name),
            coordinate: coord,
          };
        } catch {
          return null;
        }
      }
    },
    [actor, isFetching],
  );

  const clearResults = useCallback(() => {
    setState({ results: [], loading: false, error: null, noResults: false });
  }, []);

  return { ...state, geocode, reverseGeocode, clearResults };
}
