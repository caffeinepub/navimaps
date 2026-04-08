import { Locate, ZoomIn, ZoomOut } from "lucide-react";

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
  locating?: boolean;
  canLocate?: boolean;
}

export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onLocate,
  locating = false,
  canLocate = true,
}: ZoomControlsProps) {
  return (
    <div className="flex flex-col gap-1" data-ocid="zoom-controls">
      <ControlButton onClick={onZoomIn} ariaLabel="Inzoomen" ocid="zoom-in">
        <ZoomIn className="w-4 h-4" />
      </ControlButton>
      <ControlButton onClick={onZoomOut} ariaLabel="Uitzoomen" ocid="zoom-out">
        <ZoomOut className="w-4 h-4" />
      </ControlButton>
      <div className="h-px bg-border my-0.5" />
      <ControlButton
        onClick={onLocate}
        ariaLabel="Mijn locatie"
        ocid="locate-me"
        disabled={!canLocate || locating}
      >
        <Locate
          className={`w-4 h-4 ${locating ? "animate-pulse text-primary" : ""}`}
        />
      </ControlButton>
    </div>
  );
}

interface ControlButtonProps {
  onClick: () => void;
  ariaLabel: string;
  ocid: string;
  disabled?: boolean;
  children: React.ReactNode;
}

function ControlButton({
  onClick,
  ariaLabel,
  ocid,
  disabled,
  children,
}: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-ocid={ocid}
      className="map-overlay-card w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-ring outline-none"
    >
      {children}
    </button>
  );
}
