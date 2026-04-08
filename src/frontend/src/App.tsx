import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const MapPage = lazy(() => import("@/pages/MapPage"));
const NavigationPage = lazy(() => import("@/pages/NavigationPage"));

function PageLoader() {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background dark">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <span className="text-xs text-muted-foreground font-body">Laden…</span>
      </div>
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  ),
});

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: MapPage,
});

const navigerenRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/navigeren",
  validateSearch: (search: Record<string, unknown>) => ({
    bestemming:
      typeof search.bestemming === "string" ? search.bestemming : undefined,
  }),
  component: NavigationPage,
});

const routeTree = rootRoute.addChildren([mapRoute, navigerenRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
