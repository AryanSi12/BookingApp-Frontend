import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { getAllEvents } from "@/services/events";
import { Skeleton } from "@/Components/ui/skeleton";
import { toast } from "sonner";
import EventPosterCard from "@/Components/EventPosterCard";
import { EmptyState, ErrorState, PageHeader, PageShell } from "@/Components/ui/PageShell";
import { parseEventDate } from "@/lib/utils";

function useDebounced(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

const EventGrid = ({ title, subtitle, kicker = "Discover" }) => {
  const [params, setParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState(params.get("q") || "");
  const location = params.get("location") || "all";
  const sort = params.get("sort") || "soon";
  const debouncedQuery = useDebounced(query, 300);

  const loadEvents = () => {
    setLoading(true);
    setError(false);
    getAllEvents()
      .then((res) => {
        setEvents(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => {
        setError(true);
        toast.error("Failed to fetch events.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const next = new URLSearchParams(params);
    if (debouncedQuery) next.set("q", debouncedQuery);
    else next.delete("q");
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
  }, [debouncedQuery, params, setParams]);

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all" || (key === "sort" && value === "soon")) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const locations = useMemo(() => {
    const names = events
      .map((event) => event.venueId?.venueLocation)
      .filter(Boolean);
    return [...new Set(names)];
  }, [events]);

  const filtered = useMemo(() => {
    const needle = (params.get("q") || "").trim().toLowerCase();
    const list = events.filter((event) => {
      const matchesQuery =
        !needle ||
        event.title?.toLowerCase().includes(needle) ||
        event.venueId?.venueName?.toLowerCase().includes(needle) ||
        event.aboutEvent?.toLowerCase().includes(needle);
      const matchesLocation = location === "all" || event.venueId?.venueLocation === location;
      return matchesQuery && matchesLocation;
    });
    return [...list].sort((a, b) => {
      if (sort === "title") return String(a.title || "").localeCompare(String(b.title || ""));
      const aTime = parseEventDate(a.startTime)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const bTime = parseEventDate(b.startTime)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });
  }, [events, location, params, sort]);

  return (
    <PageShell>
      <PageHeader
        kicker={kicker}
        title={title}
        subtitle={subtitle}
        action={
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search events or venues"
                aria-label="Search events"
                className="field-input pl-9 sm:w-64"
              />
            </div>
            <select
              value={location}
              onChange={(event) => setFilter("location", event.target.value)}
              aria-label="Filter by location"
              className="field-input sm:w-44"
            >
              <option value="all">All locations</option>
              {locations.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(event) => setFilter("sort", event.target.value)}
              aria-label="Sort events"
              className="field-input sm:w-40"
            >
              <option value="soon">Soonest</option>
              <option value="title">Title</option>
            </select>
          </div>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Events could not be loaded"
          description="The catalog request did not succeed. You can try again."
          onRetry={loadEvents}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={events.length === 0 ? "No events available" : "No matches"}
          description={
            events.length === 0
              ? "Check back soon for new shows and venues."
              : "Try another search term or location filter."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventPosterCard key={event.eventId} event={event} variant="wide" />
          ))}
        </div>
      )}
    </PageShell>
  );
};

export default EventGrid;
