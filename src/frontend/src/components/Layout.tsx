import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronLeft, MapPin, Navigation } from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className }: LayoutProps) {
  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground font-body overflow-hidden dark">
      <Header />
      <main className={cn("flex-1 flex overflow-hidden", className)}>
        {children}
      </main>
      <footer className="shrink-0 h-7 flex items-center justify-center bg-card border-t border-border px-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Gebouwd met liefde via{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-smooth"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

function Header() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isNavPage = pathname === "/navigeren";

  return (
    <header
      className="h-12 shrink-0 flex items-center px-4 gap-3 bg-card border-b border-border z-50"
      data-ocid="header"
    >
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-2 transition-smooth hover:opacity-80"
        aria-label="Ga naar kaart"
        data-ocid="header-logo"
      >
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center shrink-0">
          <Navigation
            className="w-4 h-4 text-primary-foreground"
            strokeWidth={2.5}
          />
        </div>
        <span className="font-display font-semibold text-sm tracking-tight text-foreground hidden sm:block">
          Navigatie
        </span>
      </Link>

      <div className="w-px h-4 bg-border mx-1 hidden sm:block" />

      {/* Nav links */}
      <nav className="flex items-center gap-1" aria-label="Hoofdnavigatie">
        <NavLink
          to="/"
          icon={<MapPin className="w-3.5 h-3.5" />}
          label="Kaart"
          active={pathname === "/"}
        />
        <NavLink
          to="/navigeren"
          icon={<Navigation className="w-3.5 h-3.5" />}
          label="Navigeren"
          active={isNavPage}
        />
      </nav>

      <div className="flex-1" />

      {/* Context back button on nav page */}
      {isNavPage && (
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-smooth"
          data-ocid="header-back"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Terug naar kaart</span>
        </Link>
      )}
    </header>
  );
}

interface NavLinkProps {
  to: string;
  icon: ReactNode;
  label: string;
  active: boolean;
}

function NavLink({ to, icon, label, active }: NavLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-smooth",
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
      )}
      data-ocid={`nav-link-${label.toLowerCase()}`}
      aria-current={active ? "page" : undefined}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
