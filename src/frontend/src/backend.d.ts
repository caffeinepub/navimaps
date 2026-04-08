import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface backendInterface {
    /**
     * / Proxy OSRM routing request.
     * / Returns raw JSON string from OSRM, or an error JSON string on failure.
     */
    calculateRoute(fromLon: number, fromLat: number, toLon: number, toLat: number): Promise<string>;
    /**
     * / Proxy Nominatim geocoding request.
     * / Returns raw JSON string from Nominatim, or an error JSON string on failure.
     */
    geocodeAddress(searchQuery: string): Promise<string>;
}
