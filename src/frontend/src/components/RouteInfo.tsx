import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Route } from "@/types";
import { Clock, MapPin, Navigation, Ruler } from "lucide-react";

interface RouteInfoProps {
  route: Route;
}

export function RouteInfo({ route }: RouteInfoProps) {
  return (
    <div className="px-4 py-4 space-y-4 fade-up">
      {/* Destination header */}
      <div className="flex items-start gap-3">
        <div className="route-marker-dest shrink-0 mt-0.5">
          <MapPin className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">
            Route naar
          </p>
          <p className="text-sm font-display font-semibold text-foreground leading-tight break-words">
            {route.destination.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 break-words line-clamp-2">
            {route.destination.address}
          </p>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Ruler className="w-4 h-4" />}
          label="Afstand"
          value={route.totalDistance}
          accentColor="text-primary"
        />
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          label="Reistijd"
          value={route.totalDuration}
          accentColor="text-accent"
        />
      </div>

      {/* Arrival time */}
      <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2.5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Navigation className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Geschatte aankomsttijd</span>
        </div>
        <span className="text-sm font-display font-bold text-foreground">
          {route.estimatedArrival}
        </span>
      </div>

      {/* Step count */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Stappen</span>
        <Badge variant="secondary" className="text-xs font-mono">
          {route.steps.length}
        </Badge>
      </div>

      {/* Origin summary */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="route-marker-start w-5 h-5 shrink-0">
          <span className="text-[10px]">A</span>
        </div>
        <p className="truncate">{route.origin.name}</p>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accentColor: string;
}

function StatCard({ icon, label, value, accentColor }: StatCardProps) {
  return (
    <div className="rounded-xl bg-muted/40 px-3 py-3 flex flex-col gap-1">
      <div className={`flex items-center gap-1.5 ${accentColor}`}>
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="text-base font-display font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}
