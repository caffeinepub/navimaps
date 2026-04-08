interface LocationMarkerProps {
  /** Fractional position 0–1 within the iframe container (x, y) */
  x?: number;
  y?: number;
  accuracy?: number | null;
  /** Whether to show the pulsing ring */
  pulse?: boolean;
}

/**
 * SVG overlay marker rendered on top of the OSM iframe.
 * Positioned absolutely at the given fractional x/y within the map container.
 * Defaults to center (0.5, 0.5) — i.e. the map's center pin.
 */
export function LocationMarker({
  x = 0.5,
  y = 0.5,
  accuracy,
  pulse = true,
}: LocationMarkerProps) {
  const left = `${(x * 100).toFixed(2)}%`;
  const top = `${(y * 100).toFixed(2)}%`;

  return (
    <div
      className="absolute pointer-events-none"
      style={{ left, top, transform: "translate(-50%, -50%)" }}
      aria-hidden="true"
      data-ocid="location-marker"
    >
      {/* Accuracy ring — fades with distance */}
      {accuracy != null && accuracy < 500 && (
        <div
          className="absolute rounded-full border border-primary/30"
          style={{
            width: `${Math.min(120, Math.max(24, accuracy / 4))}px`,
            height: `${Math.min(120, Math.max(24, accuracy / 4))}px`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "oklch(0.72 0.16 185 / 0.08)",
          }}
        />
      )}

      {/* Outer pulse ring */}
      {pulse && (
        <div
          className="absolute rounded-full marker-pulse"
          style={{
            width: "36px",
            height: "36px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "oklch(0.72 0.16 185 / 0.2)",
          }}
        />
      )}

      {/* Inner dot */}
      <div
        className="relative z-10 w-4 h-4 rounded-full border-2 border-card shadow-md"
        style={{ backgroundColor: "oklch(0.72 0.16 185)" }}
      />
    </div>
  );
}
