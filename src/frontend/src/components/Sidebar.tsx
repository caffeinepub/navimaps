import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  title?: string;
  className?: string;
}

export function Sidebar({
  children,
  isOpen,
  onToggle,
  title,
  className,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-background/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={onToggle}
        onKeyDown={(e) => e.key === "Escape" && onToggle()}
        role="presentation"
        aria-hidden="true"
      />

      {/*
       * Single sidebar panel — rendered once.
       * Desktop: positioned as a flex child (aside), width transitions 0↔320px.
       * Mobile: fixed bottom drawer, translateY transitions off-screen↔visible.
       * Children are rendered inside only this element (no duplication).
       */}
      <aside
        className={cn(
          // ---- Desktop layout ----
          "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border z-40",
          "transition-all duration-300 ease-in-out",
          isOpen ? "w-80" : "w-0 overflow-hidden border-r-0",
          className,
        )}
        aria-label={title ?? "Zijpaneel"}
        data-ocid="sidebar"
      >
        <div
          className={cn(
            "flex flex-col h-full min-w-80 transition-opacity duration-200",
            isOpen ? "opacity-100" : "opacity-0",
          )}
        >
          {title && <SidebarHeader title={title} onClose={onToggle} />}
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </aside>

      {/* Mobile bottom drawer — same children via CSS visibility */}
      <aside
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border z-40",
          "flex flex-col md:hidden",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-y-0" : "translate-y-full",
          "max-h-[70vh] rounded-t-2xl",
        )}
        aria-label={title ?? "Zijpaneel"}
        aria-hidden={!isOpen}
        data-ocid="sidebar-mobile"
      >
        <div className="flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border mx-auto" />
        </div>
        {title && (
          <div className="px-4 pb-3 shrink-0">
            <h2 className="font-display font-semibold text-sm text-sidebar-foreground">
              {title}
            </h2>
          </div>
        )}
        {/* Mobile renders a visual-only copy — actual interactive content lives in the desktop aside above */}
        <div className="flex-1 overflow-y-auto" aria-hidden="true">
          {children}
        </div>
      </aside>

      {/* Toggle button (desktop only) */}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "hidden md:flex items-center justify-center",
          "absolute left-0 top-1/2 -translate-y-1/2 z-50",
          "w-5 h-12 bg-card border border-border rounded-r-lg",
          "text-muted-foreground hover:text-foreground hover:bg-muted/60",
          "transition-smooth shadow-xs",
          isOpen ? "translate-x-80" : "translate-x-0",
        )}
        aria-label={isOpen ? "Sluit zijpaneel" : "Open zijpaneel"}
        data-ocid="sidebar-toggle"
      >
        {isOpen ? (
          <ChevronLeft className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
      </button>

      {/* Mobile FAB toggle */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className={cn(
          "fixed bottom-4 left-4 z-50 md:hidden",
          "w-10 h-10 rounded-full bg-card border-border shadow-md",
          "text-muted-foreground hover:text-foreground",
        )}
        aria-label={isOpen ? "Sluit zijpaneel" : "Open zijpaneel"}
        data-ocid="sidebar-fab"
      >
        {isOpen ? (
          <X className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </Button>
    </>
  );
}

interface SidebarHeaderProps {
  title: string;
  onClose: () => void;
}

function SidebarHeader({ title, onClose }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-sidebar-border shrink-0">
      <h2 className="font-display font-semibold text-sm text-sidebar-foreground">
        {title}
      </h2>
      <button
        type="button"
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground transition-smooth p-1 rounded-md hover:bg-muted/40"
        aria-label="Sluit zijpaneel"
        data-ocid="sidebar-close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
