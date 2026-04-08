import { j as jsxRuntimeExports, r as reactExports, u as useNavigate } from "./index-BnHgEuyu.js";
import { c as createLucideIcon, Z as ZoomIn, a as ZoomOut, u as useGeolocation, b as useMap, d as useGeocoding, L as Layout, S as SearchBar, B as Button, X, N as Navigation, M as MapPin } from "./useMap-DxPo34Ru.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["line", { x1: "2", x2: "5", y1: "12", y2: "12", key: "bvdh0s" }],
  ["line", { x1: "19", x2: "22", y1: "12", y2: "12", key: "1tbv5k" }],
  ["line", { x1: "12", x2: "12", y1: "2", y2: "5", key: "11lu5j" }],
  ["line", { x1: "12", x2: "12", y1: "19", y2: "22", key: "x3vr5v" }],
  ["circle", { cx: "12", cy: "12", r: "7", key: "fim9np" }]
];
const Locate = createLucideIcon("locate", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
function LocationMarker({
  x = 0.5,
  y = 0.5,
  accuracy,
  pulse = true
}) {
  const left = `${(x * 100).toFixed(2)}%`;
  const top = `${(y * 100).toFixed(2)}%`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "absolute pointer-events-none",
      style: { left, top, transform: "translate(-50%, -50%)" },
      "aria-hidden": "true",
      "data-ocid": "location-marker",
      children: [
        accuracy != null && accuracy < 500 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute rounded-full border border-primary/30",
            style: {
              width: `${Math.min(120, Math.max(24, accuracy / 4))}px`,
              height: `${Math.min(120, Math.max(24, accuracy / 4))}px`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "oklch(0.72 0.16 185 / 0.08)"
            }
          }
        ),
        pulse && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute rounded-full marker-pulse",
            style: {
              width: "36px",
              height: "36px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "oklch(0.72 0.16 185 / 0.2)"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "relative z-10 w-4 h-4 rounded-full border-2 border-card shadow-md",
            style: { backgroundColor: "oklch(0.72 0.16 185)" }
          }
        )
      ]
    }
  );
}
function ZoomControls({
  onZoomIn,
  onZoomOut,
  onLocate,
  locating = false,
  canLocate = true
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", "data-ocid": "zoom-controls", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(ControlButton, { onClick: onZoomIn, ariaLabel: "Inzoomen", ocid: "zoom-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "w-4 h-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ControlButton, { onClick: onZoomOut, ariaLabel: "Uitzoomen", ocid: "zoom-out", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomOut, { className: "w-4 h-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-border my-0.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ControlButton,
      {
        onClick: onLocate,
        ariaLabel: "Mijn locatie",
        ocid: "locate-me",
        disabled: !canLocate || locating,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Locate,
          {
            className: `w-4 h-4 ${locating ? "animate-pulse text-primary" : ""}`
          }
        )
      }
    )
  ] });
}
function ControlButton({
  onClick,
  ariaLabel,
  ocid,
  disabled,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      disabled,
      "aria-label": ariaLabel,
      "data-ocid": ocid,
      className: "map-overlay-card w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-ring outline-none",
      children
    }
  );
}
function buildMapUrl(center, zoom, layer) {
  const delta = 0.05 / 2 ** (zoom - 13);
  const bbox = [
    center.lng - delta,
    center.lat - delta * 0.7,
    center.lng + delta,
    center.lat + delta * 0.7
  ].join(",");
  const layerParam = layer === "satelliet" ? "cyclemap" : "mapnik";
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=${layerParam}&marker=${center.lat},${center.lng}`;
}
function MapView({
  center,
  zoom,
  layer,
  userCoordinate,
  accuracy,
  loading,
  onZoomIn,
  onZoomOut,
  onLocate,
  children
}) {
  const iframeRef = reactExports.useRef(null);
  const [iframeKey, setIframeKey] = reactExports.useState(0);
  const mapUrl = buildMapUrl(center, zoom, layer);
  const prevUrlRef = reactExports.useRef(mapUrl);
  reactExports.useEffect(() => {
    if (prevUrlRef.current !== mapUrl) {
      prevUrlRef.current = mapUrl;
      setIframeKey((k) => k + 1);
    }
  }, [mapUrl]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative flex-1 overflow-hidden bg-background",
      "data-ocid": "map-view",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "iframe",
          {
            ref: iframeRef,
            title: "Kaart",
            src: mapUrl,
            className: "w-full h-full border-0",
            style: {
              filter: "invert(1) hue-rotate(200deg) brightness(0.78) saturate(0.65)"
            },
            loading: "eager",
            "aria-label": "Interactieve OpenStreetMap kaart",
            "data-ocid": "map-iframe",
            sandbox: "allow-scripts allow-same-origin"
          },
          iframeKey
        ),
        userCoordinate && /* @__PURE__ */ jsxRuntimeExports.jsx(LocationMarker, { x: 0.5, y: 0.5, accuracy, pulse: true }),
        loading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-background/40 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-overlay-card px-4 py-2.5 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground font-body", children: "Locatie bepalen…" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ZoomControls,
          {
            onZoomIn,
            onZoomOut,
            onLocate,
            locating: loading,
            canLocate: true
          }
        ) }),
        children
      ]
    }
  );
}
function MapPage() {
  const navigate = useNavigate();
  const geo = useGeolocation();
  const map = useMap(geo.coordinate ?? void 0);
  const geocoding = useGeocoding();
  const [searchValue, setSearchValue] = reactExports.useState("");
  const handleSelect = (place) => {
    setSearchValue(place.name);
    geocoding.clearResults();
    void navigate({
      to: "/navigeren",
      search: { bestemming: place.address }
    });
  };
  const handleSearch = (query) => {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    MapView,
    {
      center: map.center,
      zoom: map.zoom,
      layer: map.layer,
      userCoordinate: geo.coordinate,
      accuracy: geo.accuracy,
      loading: geo.loading,
      onZoomIn: map.zoomIn,
      onZoomOut: map.zoomOut,
      onLocate: handleLocate,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-lg px-4",
            "data-ocid": "search-overlay",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              SearchBar,
              {
                value: searchValue,
                onChange: setSearchValue,
                onSearch: handleSearch,
                suggestions: geocoding.results,
                onSelect: handleSelect,
                onClear: handleClear,
                loading: geocoding.loading,
                noResults: geocoding.noResults,
                error: geocoding.error,
                placeholder: "Zoek een bestemming…",
                icon: "search",
                className: "shadow-lg"
              }
            )
          }
        ),
        showDeniedBanner && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-20 left-1/2 -translate-x-1/2 z-10 w-full max-w-lg px-4 fade-up",
            "data-ocid": "permission-denied-banner",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-destructive/40 rounded-xl shadow-lg p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 mt-0.5 w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-destructive" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground", children: "Locatietoegang uitgeschakeld" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 leading-relaxed", children: "Schakel locatietoegang in via de browserinstellingen om je huidige locatie te zien. De kaart toont nu Amsterdam als standaard locatie." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-3 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "default",
                      className: "gap-1.5 h-7 text-xs",
                      onClick: geo.requestLocation,
                      "data-ocid": "retry-location-btn",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3" }),
                        "Toestemming opnieuw vragen"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "gap-1.5 h-7 text-xs",
                      onClick: () => window.open(
                        "https://support.google.com/chrome/answer/142065",
                        "_blank"
                      ),
                      "data-ocid": "location-settings-btn",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-3 h-3" }),
                        "Browserinstellingen"
                      ]
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: geo.dismissBanner,
                  className: "shrink-0 text-muted-foreground hover:text-foreground transition-smooth p-1 rounded-md hover:bg-muted/60",
                  "aria-label": "Sluit melding",
                  "data-ocid": "dismiss-location-banner",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                }
              )
            ] }) })
          }
        ),
        geo.error && !geo.permissionDenied && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute top-20 left-1/2 -translate-x-1/2 z-10 w-full max-w-lg px-4 fade-up",
            "data-ocid": "location-error-banner",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-overlay-card flex items-center gap-2.5 px-3 py-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: geo.error })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute bottom-6 left-1/2 -translate-x-1/2 z-10",
            "data-ocid": "navigate-cta",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "lg",
                className: "gap-2 shadow-md font-display font-semibold",
                onClick: () => void navigate({
                  to: "/navigeren",
                  search: { bestemming: void 0 }
                }),
                "data-ocid": "start-navigation-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "w-4 h-4" }),
                  "Navigeren starten"
                ]
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute bottom-6 left-4 z-10",
            "data-ocid": "location-card",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-overlay-card flex items-start gap-3 px-3 py-2.5 max-w-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "route-marker-start shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-display font-semibold text-foreground truncate", children: "Mijn locatie" }),
                geo.loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Locatie bepalen…" }) : geo.coordinate ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono", children: [
                    geo.coordinate.lat.toFixed(5),
                    ",",
                    " ",
                    geo.coordinate.lng.toFixed(5)
                  ] }),
                  geo.accuracy != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    "Nauwkeurigheid: ±",
                    Math.round(geo.accuracy),
                    " m"
                  ] })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Locatie niet beschikbaar" })
              ] })
            ] })
          }
        )
      ]
    }
  ) });
}
export {
  MapPage as default
};
