import { DirectionsList } from "@/components/DirectionsList";
import { Layout } from "@/components/Layout";
import { RouteInfo } from "@/components/RouteInfo";
import { SearchBar } from "@/components/SearchBar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGeocoding } from "@/hooks/useGeocoding";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useMap } from "@/hooks/useMap";
import { useRouting } from "@/hooks/useRouting";
import type { Coordinate, Place } from "@/types";
import { useSearch } from "@tanstack/react-router";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Navigation,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export default function NavigationPage() {
  const geo = useGeolocation();
  const map = useMap(geo.coordinate ?? undefined);
  const routing = useRouting();

  const originGeo = useGeocoding();
  const destGeo = useGeocoding();

  // Read pre-filled destination from URL search param
  const { bestemming } = useSearch({ from: "/navigeren" });

  const [originText, setOriginText] = useState("Mijn locatie");
  const [destText, setDestText] = useState(bestemming ?? "");
  const [originPlace, setOriginPlace] = useState<Place | null>(null);
  const [destPlace, setDestPlace] = useState<Place | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const mapAreaRef = useRef<HTMLDivElement>(null);

  const reverseGeocode = originGeo.reverseGeocode;
  // Reverse geocode user's location once available
  useEffect(() => {
    if (geo.coordinate && !originPlace) {
      void reverseGeocode(geo.coordinate).then((place) => {
        if (place) {
          setOriginPlace(place);
          setOriginText(place.name);
        }
      });
    }
  }, [geo.coordinate, originPlace, reverseGeocode]);

  // If bestemming URL param is set, trigger geocode search
  const geocode = destGeo.geocode;
  useEffect(() => {
    if (bestemming?.trim()) {
      void geocode(bestemming.trim());
    }
  }, [bestemming, geocode]);

  const handleCalculate = async () => {
    const originCoord = originPlace?.coordinate ?? geo.coordinate;
    if (!originCoord || !destPlace) return;

    const fallbackOriginPlace: Place = {
      id: "current",
      name: originText || "Huidige locatie",
      address: originText || "Huidige locatie",
      coordinate: originCoord,
    };

    await routing.calculateRoute(
      {
        place: originPlace ?? fallbackOriginPlace,
        coord: originCoord,
      },
      { place: destPlace, coord: destPlace.coordinate },
    );
  };

  const handleReset = () => {
    routing.clearRoute();
    setDestText("");
    setDestPlace(null);
    destGeo.clearResults();
    map.selectRoute(null);
  };

  const canCalculate = !!(
    (originPlace?.coordinate ?? geo.coordinate) &&
    destPlace?.coordinate
  );

  const selectRoute = map.selectRoute;
  // Center map on route when calculated
  useEffect(() => {
    if (routing.route) {
      selectRoute(routing.route);
    }
  }, [routing.route, selectRoute]);

  const zoom = map.zoom;
  const factor = 0.05 / (zoom / 13);
  const bboxMinLng = map.center.lng - factor;
  const bboxMinLat = map.center.lat - factor * 0.7;
  const bboxMaxLng = map.center.lng + factor;
  const bboxMaxLat = map.center.lat + factor * 0.7;
  const bbox = [bboxMinLng, bboxMinLat, bboxMaxLng, bboxMaxLat].join(",");

  // Project lat/lng to SVG pixel coords based on current bbox
  function projectToPixel(
    coord: Coordinate,
    width: number,
    height: number,
  ): { x: number; y: number } {
    const x = ((coord.lng - bboxMinLng) / (bboxMaxLng - bboxMinLng)) * width;
    const y = ((bboxMaxLat - coord.lat) / (bboxMaxLat - bboxMinLat)) * height;
    return { x, y };
  }

  return (
    <Layout>
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
          title="Navigatie Details"
          className="relative"
        >
          <div className="flex flex-col h-full">
            {/* Search form */}
            <div className="px-4 pt-4 pb-3 space-y-2 shrink-0 border-b border-sidebar-border">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Vertrekpunt
                </p>
                <SearchBar
                  value={originText}
                  onChange={setOriginText}
                  onSearch={(q) => {
                    void originGeo.geocode(q);
                  }}
                  suggestions={originGeo.results}
                  onSelect={(p) => {
                    setOriginPlace(p);
                    setOriginText(p.name);
                    originGeo.clearResults();
                  }}
                  onClear={() => {
                    setOriginPlace(null);
                    setOriginText("");
                    originGeo.clearResults();
                  }}
                  loading={originGeo.loading}
                  noResults={originGeo.noResults}
                  error={originGeo.error}
                  placeholder="Vertrekpunt…"
                  icon="origin"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Bestemming
                </p>
                <SearchBar
                  value={destText}
                  onChange={setDestText}
                  onSearch={(q) => {
                    void destGeo.geocode(q);
                  }}
                  suggestions={destGeo.results}
                  onSelect={(p) => {
                    setDestPlace(p);
                    setDestText(p.name);
                    destGeo.clearResults();
                  }}
                  onClear={() => {
                    setDestPlace(null);
                    setDestText("");
                    destGeo.clearResults();
                  }}
                  loading={destGeo.loading}
                  noResults={destGeo.noResults}
                  error={destGeo.error}
                  placeholder="Zoek een bestemming…"
                  icon="destination"
                />
              </div>

              <Button
                className="w-full gap-2 font-display font-semibold mt-1"
                onClick={() => {
                  void handleCalculate();
                }}
                disabled={!canCalculate || routing.loading}
                data-ocid="calculate-route-btn"
              >
                {routing.loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                {routing.loading ? "Route berekenen…" : "Route berekenen"}
              </Button>

              {routing.route && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-smooth py-1"
                  data-ocid="reset-route-btn"
                >
                  <RotateCcw className="w-3 h-3" />
                  Nieuwe route
                </button>
              )}
            </div>

            {/* Error */}
            {routing.error && (
              <div
                className="mx-4 mt-4 flex items-start gap-2 rounded-lg border border-destructive/40 px-3 py-2.5 fade-up"
                style={{ backgroundColor: "oklch(var(--destructive) / 0.1)" }}
                data-ocid="route-error"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-destructive mt-0.5" />
                <p className="text-xs text-destructive leading-snug">
                  {routing.error}
                </p>
              </div>
            )}

            {/* Loading skeleton */}
            {routing.loading && (
              <div className="px-4 py-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Separator />
                {["sk1", "sk2", "sk3", "sk4"].map((id) => (
                  <div key={id} className="flex gap-3 items-start">
                    <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3.5 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Route info + directions */}
            {routing.route && !routing.loading && (
              <>
                <RouteInfo route={routing.route} />
                <Separator className="bg-sidebar-border shrink-0" />
                <div className="flex-1 overflow-y-auto">
                  <DirectionsList
                    steps={routing.route.steps}
                    activeIndex={map.activeStepIndex}
                    onStepClick={map.setActiveStep}
                  />
                </div>
                {/* Step nav controls */}
                <div className="px-4 py-3 border-t border-sidebar-border flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={map.prevStep}
                    disabled={map.activeStepIndex === 0}
                    className="flex-1 gap-1.5"
                    data-ocid="nav-prev-step"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Vorige
                  </Button>
                  <Button
                    size="sm"
                    onClick={map.nextStep}
                    disabled={
                      map.activeStepIndex === routing.route.steps.length - 1
                    }
                    className="flex-1 gap-1.5"
                    data-ocid="nav-next-step"
                  >
                    Volgende
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </>
            )}

            {/* Empty state */}
            {!routing.route && !routing.loading && !routing.error && (
              <div
                className="flex flex-col items-center justify-center flex-1 px-6 text-center gap-3 py-10"
                data-ocid="empty-state"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "oklch(var(--primary) / 0.12)" }}
                >
                  <Navigation className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-display font-semibold text-foreground">
                    Plan uw route
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Voer een bestemming in en klik op{" "}
                    <span className="text-primary font-medium">
                      Route berekenen
                    </span>{" "}
                    om de routebeschrijving te bekijken.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Sidebar>

        {/* Map area */}
        <div
          ref={mapAreaRef}
          className="map-container flex-1 relative"
          data-ocid="map-area"
        >
          <iframe
            ref={iframeRef}
            title="Navigatiekaart"
            className="w-full h-full border-0 map-tile-dark"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`}
            loading="lazy"
            aria-label="Navigatiekaart"
            data-ocid="nav-map-iframe"
          />

          {/* SVG route polyline overlay */}
          {routing.route &&
            !routing.loading &&
            routing.route.polyline.length > 1 && (
              <RoutePolylineOverlay
                polyline={routing.route.polyline}
                projectToPixel={projectToPixel}
              />
            )}

          {/* Active step overlay */}
          {routing.route && !routing.loading && (
            <ActiveStepOverlay
              step={routing.route.steps[map.activeStepIndex]}
              stepIndex={map.activeStepIndex}
              totalSteps={routing.route.steps.length}
              onPrev={map.prevStep}
              onNext={map.nextStep}
            />
          )}

          {/* Zoom controls */}
          <div
            className="absolute top-16 right-4 z-10 flex flex-col gap-1.5"
            data-ocid="map-zoom-controls"
          >
            <MapControlButton
              onClick={map.zoomIn}
              ariaLabel="Inzoomen"
              ocid="nav-zoom-in"
            >
              <ZoomIn className="w-4 h-4" />
            </MapControlButton>
            <MapControlButton
              onClick={map.zoomOut}
              ariaLabel="Uitzoomen"
              ocid="nav-zoom-out"
            >
              <ZoomOut className="w-4 h-4" />
            </MapControlButton>
          </div>

          {/* Route summary pill */}
          {routing.route && !routing.loading && (
            <div
              className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 fade-up"
              data-ocid="route-summary-overlay"
            >
              <div className="map-overlay-card flex items-center gap-4 px-5 py-3">
                <SummaryItem
                  label="Afstand"
                  value={routing.route.totalDistance}
                />
                <div className="w-px h-7 bg-border" />
                <SummaryItem
                  label="Reistijd"
                  value={routing.route.totalDuration}
                />
                <div className="w-px h-7 bg-border" />
                <SummaryItem
                  label="Aankomst"
                  value={routing.route.estimatedArrival}
                  highlight
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// --- Sub-components ---

interface RoutePolylineOverlayProps {
  polyline: Coordinate[];
  projectToPixel: (
    coord: Coordinate,
    width: number,
    height: number,
  ) => { x: number; y: number };
}

function RoutePolylineOverlay({
  polyline,
  projectToPixel,
}: RoutePolylineOverlayProps) {
  const [size, setSize] = useState({ width: 800, height: 600 });
  const containerRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = containerRef.current?.parentElement;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const e = entries[0];
      if (e) {
        setSize({
          width: e.contentRect.width,
          height: e.contentRect.height,
        });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const points = polyline
    .map((c) => {
      const { x, y } = projectToPixel(c, size.width, size.height);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const first = polyline[0];
  const last = polyline[polyline.length - 1];
  const startPx = first ? projectToPixel(first, size.width, size.height) : null;
  const endPx = last ? projectToPixel(last, size.width, size.height) : null;

  return (
    <svg
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 5 }}
      viewBox={`0 0 ${size.width} ${size.height}`}
      aria-hidden="true"
      data-ocid="route-polyline-svg"
    >
      {/* Route shadow */}
      <polyline
        points={points}
        fill="none"
        stroke="oklch(0.13 0.014 255)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.4"
      />
      {/* Route line */}
      <polyline
        points={points}
        fill="none"
        stroke="oklch(0.72 0.16 185)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {/* Start marker */}
      {startPx && (
        <circle
          cx={startPx.x}
          cy={startPx.y}
          r="7"
          fill="oklch(0.72 0.22 142)"
          stroke="oklch(0.95 0.01 260)"
          strokeWidth="2"
        />
      )}
      {/* End marker */}
      {endPx && (
        <circle
          cx={endPx.x}
          cy={endPx.y}
          r="7"
          fill="oklch(0.72 0.16 185)"
          stroke="oklch(0.95 0.01 260)"
          strokeWidth="2"
        />
      )}
    </svg>
  );
}

// useState needed inside RoutePolylineOverlay — import at top, already done above

interface ActiveStepOverlayProps {
  step: { instruction: string; distance: string } | undefined;
  stepIndex: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
}

function ActiveStepOverlay({
  step,
  stepIndex,
  totalSteps,
  onPrev,
  onNext,
}: ActiveStepOverlayProps) {
  if (!step) return null;
  return (
    <div
      className="absolute top-4 left-4 right-20 z-10 fade-up"
      data-ocid="active-step-overlay"
    >
      <div className="map-overlay-card flex items-center gap-3 px-3 py-2.5 max-w-sm">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: "oklch(var(--primary) / 0.2)" }}
        >
          <Navigation className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground leading-snug truncate">
            {step.instruction}
          </p>
          <p className="text-xs text-muted-foreground font-mono">
            {step.distance}
          </p>
        </div>
        <div className="flex flex-col gap-1 shrink-0">
          <button
            type="button"
            onClick={onPrev}
            disabled={stepIndex === 0}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-smooth"
            aria-label="Vorige stap"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={stepIndex === totalSteps - 1}
            className="text-muted-foreground hover:text-foreground disabled:opacity-30 transition-smooth"
            aria-label="Volgende stap"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface MapControlButtonProps {
  onClick: () => void;
  children: ReactNode;
  ariaLabel: string;
  ocid: string;
}

function MapControlButton({
  onClick,
  children,
  ariaLabel,
  ocid,
}: MapControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="map-overlay-card w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth"
      aria-label={ariaLabel}
      data-ocid={ocid}
    >
      {children}
    </button>
  );
}

interface SummaryItemProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function SummaryItem({ label, value, highlight = false }: SummaryItemProps) {
  return (
    <div className="text-center">
      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p
        className={`text-sm font-display font-bold ${highlight ? "text-primary" : "text-foreground"}`}
      >
        {value}
      </p>
    </div>
  );
}
