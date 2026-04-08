import { Layout } from "@/components/Layout";
import { MapView } from "@/components/MapView";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { useGeocoding } from "@/hooks/useGeocoding";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useMap } from "@/hooks/useMap";
import type { Place } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  MapPin,
  Navigation,
  RefreshCw,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";

export default function MapPage() {
  const navigate = useNavigate();
  const geo = useGeolocation();
  const map = useMap(geo.coordinate ?? undefined);
  const geocoding = useGeocoding();
  const [searchValue, setSearchValue] = useState("");

  const handleSelect = (place: Place) => {
    setSearchValue(place.name);
    geocoding.clearResults();
    void navigate({
      to: "/navigeren",
      search: { bestemming: place.address },
    });
  };

  const handleSearch = (query: string) => {
    void geocoding.geocode(query);
  };

  const handleClear = () => {
    setSearchValue("");
    geocoding.clearResults();
  };

  const handleLocate = () => {
    geo.requestLocation();
    if (geo.coordinate) {
      map.setCenter(geo.coordinate);
    }
  };

  const showDeniedBanner = geo.permissionDenied && !geo.dismissed;

  return (
    <Layout>
      <MapView
        center={map.center}
        zoom={map.zoom}
        layer={map.layer}
        userCoordinate={geo.coordinate}
        accuracy={geo.accuracy}
        loading={geo.loading}
        onZoomIn={map.zoomIn}
        onZoomOut={map.zoomOut}
        onLocate={handleLocate}
      >
        {/* Search bar overlay */}
        <div
          className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-lg px-4"
          data-ocid="search-overlay"
        >
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onSearch={handleSearch}
            suggestions={geocoding.results}
            onSelect={handleSelect}
            onClear={handleClear}
            loading={geocoding.loading}
            noResults={geocoding.noResults}
            error={geocoding.error}
            placeholder="Zoek een bestemming…"
            icon="search"
            className="shadow-lg"
          />
        </div>

        {/* Permission denied banner — prominent, dismissible */}
        {showDeniedBanner && (
          <div
            className="absolute top-20 left-1/2 -translate-x-1/2 z-10 w-full max-w-lg px-4 fade-up"
            data-ocid="permission-denied-banner"
          >
            <div className="bg-card border border-destructive/40 rounded-xl shadow-lg p-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-display font-semibold text-foreground">
                    Locatietoegang uitgeschakeld
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Schakel locatietoegang in via de browserinstellingen om je
                    huidige locatie te zien. De kaart toont nu Amsterdam als
                    standaard locatie.
                  </p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-1.5 h-7 text-xs"
                      onClick={geo.requestLocation}
                      data-ocid="retry-location-btn"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Toestemming opnieuw vragen
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5 h-7 text-xs"
                      onClick={() =>
                        window.open(
                          "https://support.google.com/chrome/answer/142065",
                          "_blank",
                        )
                      }
                      data-ocid="location-settings-btn"
                    >
                      <Settings className="w-3 h-3" />
                      Browserinstellingen
                    </Button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={geo.dismissBanner}
                  className="shrink-0 text-muted-foreground hover:text-foreground transition-smooth p-1 rounded-md hover:bg-muted/60"
                  aria-label="Sluit melding"
                  data-ocid="dismiss-location-banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* General error (non-permission) */}
        {geo.error && !geo.permissionDenied && (
          <div
            className="absolute top-20 left-1/2 -translate-x-1/2 z-10 w-full max-w-lg px-4 fade-up"
            data-ocid="location-error-banner"
          >
            <div className="map-overlay-card flex items-center gap-2.5 px-3 py-2.5">
              <AlertTriangle className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground">{geo.error}</p>
            </div>
          </div>
        )}

        {/* Start navigation CTA */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
          data-ocid="navigate-cta"
        >
          <Button
            size="lg"
            className="gap-2 shadow-md font-display font-semibold"
            onClick={() =>
              void navigate({
                to: "/navigeren",
                search: { bestemming: undefined },
              })
            }
            data-ocid="start-navigation-btn"
          >
            <Navigation className="w-4 h-4" />
            Navigeren starten
          </Button>
        </div>

        {/* Coordinates + accuracy info */}
        <div
          className="absolute bottom-6 left-4 z-10"
          data-ocid="location-card"
        >
          <div className="map-overlay-card flex items-start gap-3 px-3 py-2.5 max-w-xs">
            <div className="route-marker-start shrink-0 mt-0.5">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-display font-semibold text-foreground truncate">
                Mijn locatie
              </p>
              {geo.loading ? (
                <p className="text-xs text-muted-foreground">
                  Locatie bepalen…
                </p>
              ) : geo.coordinate ? (
                <>
                  <p className="text-xs text-muted-foreground font-mono">
                    {geo.coordinate.lat.toFixed(5)},{" "}
                    {geo.coordinate.lng.toFixed(5)}
                  </p>
                  {geo.accuracy != null && (
                    <p className="text-xs text-muted-foreground">
                      Nauwkeurigheid: ±{Math.round(geo.accuracy)} m
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Locatie niet beschikbaar
                </p>
              )}
            </div>
          </div>
        </div>
      </MapView>
    </Layout>
  );
}
