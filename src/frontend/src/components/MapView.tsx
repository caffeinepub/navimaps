import { LocationMarker } from "@/components/LocationMarker";
import { ZoomControls } from "@/components/ZoomControls";
import type { Coordinate, MapLayer } from "@/types";
import { useEffect, useRef, useState } from "react";

interface MapViewProps {
  center: Coordinate;
  zoom: number;
  layer: MapLayer;
  userCoordinate: Coordinate | null;
  accuracy: number | null;
  loading: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
  children?: React.ReactNode;
}

function buildMapUrl(
  center: Coordinate,
  zoom: number,
  layer: MapLayer,
): string {
  const delta = 0.05 / 2 ** (zoom - 13);
  const bbox = [
    center.lng - delta,
    center.lat - delta * 0.7,
    center.lng + delta,
    center.lat + delta * 0.7,
  ].join(",");

  const layerParam = layer === "satelliet" ? "cyclemap" : "mapnik";
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=${layerParam}&marker=${center.lat},${center.lng}`;
}

export function MapView({
  center,
  zoom,
  layer,
  userCoordinate,
  accuracy,
  loading,
  onZoomIn,
  onZoomOut,
  onLocate,
  children,
}: MapViewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeKey, setIframeKey] = useState(0);

  // Re-render iframe when center or zoom changes meaningfully
  const mapUrl = buildMapUrl(center, zoom, layer);
  const prevUrlRef = useRef(mapUrl);
  useEffect(() => {
    if (prevUrlRef.current !== mapUrl) {
      prevUrlRef.current = mapUrl;
      setIframeKey((k) => k + 1);
    }
  }, [mapUrl]);

  return (
    <div
      className="relative flex-1 overflow-hidden bg-background"
      data-ocid="map-view"
    >
      {/* OSM iframe with dark tile filter */}
      <iframe
        key={iframeKey}
        ref={iframeRef}
        title="Kaart"
        src={mapUrl}
        className="w-full h-full border-0"
        style={{
          filter:
            "invert(1) hue-rotate(200deg) brightness(0.78) saturate(0.65)",
        }}
        loading="eager"
        aria-label="Interactieve OpenStreetMap kaart"
        data-ocid="map-iframe"
        sandbox="allow-scripts allow-same-origin"
      />

      {/* User location marker — always at viewport center since map re-centers */}
      {userCoordinate && (
        <LocationMarker x={0.5} y={0.5} accuracy={accuracy} pulse />
      )}

      {/* Loading shimmer */}
      {loading && (
        <div className="absolute inset-0 bg-background/40 flex items-center justify-center pointer-events-none">
          <div className="map-overlay-card px-4 py-2.5 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" />
            <span className="text-xs text-foreground font-body">
              Locatie bepalen…
            </span>
          </div>
        </div>
      )}

      {/* Zoom + locate controls — top right */}
      <div className="absolute top-4 right-4 z-10">
        <ZoomControls
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onLocate={onLocate}
          locating={loading}
          canLocate
        />
      </div>

      {/* Slot for page-level overlays (search bar, CTAs, info cards) */}
      {children}
    </div>
  );
}
