import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, PlusSquare, Search, Ticket } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getAllEvents } from "@/services/events";
import EventPosterCard from "@/Components/EventPosterCard";
import { EmptyState, ErrorState, Surface } from "@/Components/ui/PageShell";

const CATEGORIES = ["Music", "Comedy", "Sports", "Theatre", "Workshops", "Food"];

const Hero = () => {
  const { userDetails, isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [search, setSearch] = useState("");
  const scrollContainerRef = useRef(null);
  const isOrganizer = isLoggedIn && userDetails?.roles?.includes("ORGANIZER");

  const fetchEvents = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await getAllEvents();
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setLoadError(true);
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/get-all-events?q=${encodeURIComponent(query)}` : "/get-all-events");
  };

  const scrollByCards = (direction) => {
    scrollContainerRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  return (
    <div className="pb-20 pt-16">
      <section className="relative overflow-hidden border-b border-[color:var(--border)]">
        <div className="hero-wash absolute inset-0" />
        <div className="page-shell relative grid gap-10 py-12 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-16">
          <div className="fade-up max-w-xl">
            <p className="section-kicker">EventSphere</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] text-ink md:text-6xl">
              Book the show.<br />Own the seat.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 md:text-lg">
              A cleaner ticket marketplace for discovering events, choosing seats, and walking in with your booking ready.
            </p>
            <form onSubmit={submitSearch} className="mt-7 flex max-w-lg flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search shows, venues, cities"
                  aria-label="Search shows"
                  className="field-input pl-9"
                />
              </div>
              <button type="submit" className="brand-btn">Search</button>
            </form>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to={isLoggedIn ? "/book-events" : "/login"} className="ghost-btn">
                Book tickets
              </Link>
              <Link to="/get-all-events" className="ghost-btn">
                Browse all events
              </Link>
            </div>
          </div>

          <Surface className="fade-up-delay overflow-hidden p-5 md:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <Ticket className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-ink">Tonight near you</p>
                <p className="text-sm text-slate-500">Pick a poster, choose seats, pay in seconds.</p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label: "Live events", value: loading ? "…" : String(events.length) },
                { label: "Seat map", value: "Live" },
                { label: "Checkout", value: "Secure" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-muted px-3 py-4 text-center">
                  <p className="font-display text-lg font-bold text-ink">{item.value}</p>
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      </section>

      <section className="page-shell py-12 md:py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">Recommended</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink md:text-3xl">Events worth booking</h2>
          </div>
          <Link to="/get-all-events" className="text-sm font-semibold text-brand hover:underline">
            See all
          </Link>
        </div>

        {loading ? (
          <div className="no-scrollbar flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-[22rem] w-44 shrink-0 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : loadError ? (
          <ErrorState
            title="Listings unavailable"
            description="The event catalog did not load. Try again in a moment."
            onRetry={fetchEvents}
          />
        ) : events.length === 0 ? (
          <EmptyState
            title="No events yet"
            description="When organizers publish shows, they will appear here as posters ready to book."
            action={<Link to="/get-all-events" className="brand-btn">Refresh listings</Link>}
          />
        ) : (
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute -left-3 top-[42%] z-10 hidden rounded-full border-border bg-card shadow-md md:inline-flex"
              onClick={() => scrollByCards(-1)}
              aria-label="Scroll events left"
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute -right-3 top-[42%] z-10 hidden rounded-full border-border bg-card shadow-md md:inline-flex"
              onClick={() => scrollByCards(1)}
              aria-label="Scroll events right"
            >
              <ChevronRight />
            </Button>
            <div
              ref={scrollContainerRef}
              className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2"
            >
              {events.map((event) => (
                <EventPosterCard
                  key={event.eventId}
                  event={event}
                  className="w-[46%] shrink-0 sm:w-44 md:w-52"
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="page-shell pb-4">
        <p className="section-kicker">Browse by word</p>
        <h2 className="mt-2 font-display text-2xl font-bold text-ink">Find a kind of night</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORIES.map((name) => (
            <Link key={name} to={`/get-all-events?q=${encodeURIComponent(name)}`} className="chip hover:border-primary hover:text-primary">
              {name}
            </Link>
          ))}
        </div>
      </section>

      <section className="page-shell grid gap-4 py-8 md:grid-cols-3">
        {[
          { step: "01", title: "Pick a show", copy: "Search the catalog or start from a poster." },
          { step: "02", title: "Choose seats", copy: "VIP and regular seats are priced in the hall map." },
          { step: "03", title: "Pay and keep the ticket", copy: "Checkout confirms the seats you already selected." },
        ].map((item) => (
          <Surface key={item.step} className="p-5">
            <p className="font-mono text-xs font-semibold text-primary">{item.step}</p>
            <h3 className="mt-2 font-display text-lg font-bold text-ink">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.copy}</p>
          </Surface>
        ))}
      </section>

      <section className="page-shell pb-4">
        <Surface className="flex flex-col items-start justify-between gap-4 bg-gradient-to-br from-primary-50 via-card to-accent-50 p-6 md:flex-row md:items-center dark:from-primary-950 dark:via-card dark:to-accent-950">
          <div>
            <p className="section-kicker">Organizers</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink">Put your hall on sale</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create a venue, publish an event, and watch seats fill.</p>
          </div>
          <Link to={isOrganizer ? "/Organizer" : "/signup-organizer"} className="brand-btn">
            {isOrganizer ? "Open dashboard" : "Host an event"}
          </Link>
        </Surface>
      </section>

      {isOrganizer && (
        <section className="page-shell grid gap-4 md:grid-cols-2">
          <Link to="/create-event" className="surface-card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(17,24,39,0.08)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <PlusSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink">Create an event</p>
              <p className="text-sm text-slate-500">List a show and start selling seats.</p>
            </div>
          </Link>
          <Link to="/create-venue" className="surface-card flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(17,24,39,0.08)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-lg font-semibold text-ink">Add a venue</p>
              <p className="text-sm text-slate-500">Set the hall layout once and reuse it.</p>
            </div>
          </Link>
        </section>
      )}
    </div>
  );
};

export default Hero;
