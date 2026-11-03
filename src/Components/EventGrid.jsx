import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { Skeleton } from "@/Components/ui/skeleton";
import { toast } from "sonner";
import EventPosterCard from "@/Components/EventPosterCard";
import { EmptyState, PageHeader, PageShell } from "@/Components/ui/PageShell";

const EventGrid = ({ title, subtitle, kicker = "Discover" }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("all");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("https://bookingapp-backend-hsy3.onrender.com/User/getAllEvents", {
          withCredentials: true,
        });
        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch {
        toast.error("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const locations = useMemo(() => {
    const names = events
      .map((event) => event.venueId?.venueLocation)
      .filter(Boolean);
    return [...new Set(names)];
  }, [events]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesQuery =
        !needle ||
        event.title?.toLowerCase().includes(needle) ||
        event.venueId?.venueName?.toLowerCase().includes(needle) ||
        event.aboutEvent?.toLowerCase().includes(needle);
      const matchesLocation = location === "all" || event.venueId?.venueLocation === location;
      return matchesQuery && matchesLocation;
    });
  }, [events, query, location]);

  return (
    <PageShell>
      <PageHeader
        kicker={kicker}
        title={title}
        subtitle={subtitle}
        action={
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search events or venues"
                className="field-input pl-9 sm:w-64"
              />
            </div>
            <select
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="field-input sm:w-44"
            >
              <option value="all">All locations</option>
              {locations.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        }
      />

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((event) => (
            <EventPosterCard key={event.eventId} event={event} />
          ))}
        </div>
      )}
    </PageShell>
  );
};

export default EventGrid;
