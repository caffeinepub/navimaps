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

/** Direct Nominatim search — primary geocoding method */
async function nominatimSearch(query: string): Promise<NominatimResult[]> {
  const params = new URLSearchParams({
    q: query,
    format: "json",
    limit: "5",
    addressdetails: "1",
  });
  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
  console.log("[useGeocoding] Nominatim search:", url);
  const res = await fetch(url, {
    headers: {
      "Accept-Language": "nl",
      "User-Agent": "NaviMaps/1.0 (caffeine.ai)",
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data)) throw new Error("Nominatim returned non-array");
  return data as NominatimResult[];
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
      console.log(`[useGeocoding] geocode("${trimmed}")`);

      // Use Nominatim directly as the primary path — it's fast and reliable.
      // Only fall back to the backend actor if direct fetch fails.
      try {
        const data = await nominatimSearch(trimmed);

        if (data.length === 0) {
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
      } catch (nominatimErr) {
        console.warn(
          "[useGeocoding] Nominatim mislukt, probeer backend actor:",
          nominatimErr,
        );

        // Fallback: try backend canister
        const actorReady = actor && !isFetching;
        if (actorReady) {
          try {
            const jsonStr = await (
              actor as { geocodeAddress: (q: string) => Promise<string> }
            ).geocodeAddress(trimmed);
            const parsed = JSON.parse(jsonStr) as
              | NominatimResult[]
              | { error?: string };
            if (Array.isArray(parsed) && parsed.length > 0) {
              const places = parseNominatimResults(parsed);
              setState({
                results: places,
                loading: false,
                error: null,
                noResults: false,
              });
              return places;
            }
            setState({
              results: [],
              loading: false,
              error: null,
              noResults: true,
            });
            return [];
          } catch (backendErr) {
            console.error(
              "[useGeocoding] Backend actor ook mislukt:",
              backendErr,
            );
          }
        }

        setState({
          results: [],
          loading: false,
          error:
            "Zoeken tijdelijk niet beschikbaar. Controleer uw internetverbinding.",
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
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${coord.lat}&lon=${coord.lng}&format=json&addressdetails=1`;
        const res = await fetch(url, {
          headers: {
            "Accept-Language": "nl",
            "User-Agent": "NaviMaps/1.0 (caffeine.ai)",
            Accept: "application/json",
          },
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
