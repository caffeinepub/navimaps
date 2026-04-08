import { cn } from "@/lib/utils";
import type { Place } from "@/types";
import { Loader2, MapPin, Navigation, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: (query: string) => void;
  suggestions: Place[];
  onSelect: (place: Place) => void;
  onClear: () => void;
  loading?: boolean;
  noResults?: boolean;
  error?: string | null;
  placeholder: string;
  icon?: "origin" | "destination" | "search";
  disabled?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  suggestions,
  onSelect,
  onClear,
  loading = false,
  noResults = false,
  error,
  placeholder,
  icon = "destination",
  disabled = false,
  className,
}: SearchBarProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Tracks whether the pointer is held down inside the dropdown — prevents blur from closing it
  const dropdownMouseDown = useRef(false);

  // Re-open dropdown when new suggestions arrive while input is focused (handles async delay)
  useEffect(() => {
    if (
      (suggestions.length > 0 || loading || noResults) &&
      document.activeElement === inputRef.current
    ) {
      setOpen(true);
    }
  }, [suggestions, loading, noResults]);

  const showDropdown = open && (loading || suggestions.length > 0 || noResults);

  const handleChange = (val: string) => {
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.trim().length >= 2) {
      setOpen(true);
      debounceRef.current = setTimeout(() => {
        onSearch(val);
      }, 350);
    } else {
      setOpen(false);
    }
  };

  const handleSelect = (place: Place) => {
    dropdownMouseDown.current = false;
    onSelect(place);
    onChange(place.name);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleClear = () => {
    onClear();
    onChange("");
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleBlur = () => {
    // If the pointer is inside the dropdown, don't close — the mousedown handler will call handleSelect
    if (dropdownMouseDown.current) return;
    // Small delay so a quick click on the dropdown still registers first
    setTimeout(() => {
      if (!dropdownMouseDown.current) setOpen(false);
    }, 200);
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2.5 transition-smooth",
          "focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent",
          error && "border-destructive focus-within:ring-destructive",
          disabled && "opacity-60 cursor-not-allowed",
        )}
      >
        <span className="shrink-0 text-muted-foreground">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : icon === "origin" ? (
            <div className="w-4 h-4 rounded-full border-2 border-accent flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            </div>
          ) : icon === "search" ? (
            <Search className="w-4 h-4" />
          ) : (
            <MapPin className="w-4 h-4 text-primary" />
          )}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              if (debounceRef.current) clearTimeout(debounceRef.current);
              onSearch(value);
              setOpen(true);
            }
            if (e.key === "Escape") setOpen(false);
          }}
          onFocus={() => {
            if (suggestions.length > 0 || loading || noResults) setOpen(true);
          }}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
          aria-label={placeholder}
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          data-ocid={`search-input-${icon}`}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-smooth p-0.5 rounded"
            aria-label="Wis invoer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-1 text-xs text-destructive px-1 fade-up">{error}</p>
      )}

      {/* Suggestions dropdown */}
      {showDropdown && (
        <div
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden fade-up"
          data-ocid="search-suggestions"
          // Set flag on pointer down so blur handler knows not to close the dropdown
          onMouseDown={() => {
            dropdownMouseDown.current = true;
          }}
          onMouseUp={() => {
            dropdownMouseDown.current = false;
          }}
          // Touch support
          onTouchStart={() => {
            dropdownMouseDown.current = true;
          }}
          onTouchEnd={() => {
            dropdownMouseDown.current = false;
          }}
        >
          {/* Loading state */}
          {loading && (
            <div className="flex items-center gap-2.5 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span>Zoeken…</span>
            </div>
          )}

          {/* Results */}
          {!loading &&
            suggestions.map((place) => (
              <button
                key={place.id}
                type="button"
                onMouseDown={(e) => {
                  // Prevent input blur from firing before we handle selection
                  e.preventDefault();
                  handleSelect(place);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleSelect(place);
                }}
                className="w-full flex items-start gap-3 px-3 py-2.5 text-left hover:bg-muted/50 active:bg-muted transition-smooth border-t border-border/50 first:border-t-0 cursor-pointer"
                data-ocid={`suggestion-${place.id}`}
              >
                <Navigation className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {place.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {place.address}
                  </p>
                </div>
              </button>
            ))}

          {/* No results */}
          {!loading && noResults && (
            <div
              className="flex items-center gap-2.5 px-4 py-3 text-sm text-muted-foreground"
              data-ocid="no-results"
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>Geen resultaten gevonden</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
