import { cn } from "@/lib/utils";
import type { NavigationStep, TurnDirection } from "@/types";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CircleDot,
  Flag,
  MapPin,
  Milestone,
} from "lucide-react";

interface DirectionsListProps {
  steps: NavigationStep[];
  activeIndex: number;
  onStepClick: (index: number) => void;
}

export function DirectionsList({
  steps,
  activeIndex,
  onStepClick,
}: DirectionsListProps) {
  if (steps.length === 0) return null;

  return (
    <div className="flex flex-col" data-ocid="directions-list">
      <div className="px-4 py-2 border-b border-sidebar-border">
        <p className="text-xs font-display font-semibold uppercase tracking-wide text-muted-foreground">
          Routebeschrijving
        </p>
      </div>
      {steps.map((step, index) => (
        <DirectionStep
          key={step.id}
          step={step}
          index={index}
          isActive={index === activeIndex}
          isLast={index === steps.length - 1}
          onClick={() => onStepClick(index)}
        />
      ))}
    </div>
  );
}

interface DirectionStepProps {
  step: NavigationStep;
  index: number;
  isActive: boolean;
  isLast: boolean;
  onClick: () => void;
}

function DirectionStep({
  step,
  index,
  isActive,
  isLast,
  onClick,
}: DirectionStepProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "nav-step w-full text-left flex items-start gap-3",
        isActive && "active",
      )}
      data-ocid={`direction-step-${index}`}
    >
      {/* Step connector line */}
      <div className="relative flex flex-col items-center shrink-0">
        <div className={cn("step-icon", isActive && "bg-primary/20")}>
          <DirectionIcon direction={step.direction} isActive={isActive} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 min-h-4 mt-1 bg-sidebar-border" />
        )}
      </div>

      {/* Step content */}
      <div className="flex-1 min-w-0 pb-1">
        <p
          className={cn(
            "text-sm leading-snug break-words",
            isActive
              ? "text-foreground font-medium"
              : "text-sidebar-foreground",
          )}
        >
          {step.instruction}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground font-mono">
            {step.distance}
          </span>
          {step.streetName && (
            <>
              <span className="text-muted-foreground/40 text-xs">·</span>
              <span className="text-xs text-muted-foreground truncate">
                {step.streetName}
              </span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}

function DirectionIcon({
  direction,
  isActive,
}: {
  direction: TurnDirection;
  isActive: boolean;
}) {
  const cls = cn(
    "w-4 h-4",
    isActive ? "text-primary" : "text-muted-foreground",
  );

  switch (direction) {
    case "rechtsaf":
      return <ArrowRight className={cls} />;
    case "linksaf":
      return <ArrowLeft className={cls} />;
    case "rechtdoor":
      return <ArrowUp className={cls} />;
    case "rotonde":
      return <CircleDot className={cls} />;
    case "snelweg":
      return <Milestone className={cls} />;
    case "bestemming":
      return <Flag className={cn(cls, "text-primary")} />;
    case "start":
      return <MapPin className={cn(cls, "text-accent")} />;
    default:
      return <ArrowUp className={cls} />;
  }
}
