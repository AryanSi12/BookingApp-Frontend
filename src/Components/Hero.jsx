import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, PlusSquare, Ticket } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import EventPosterCard from "@/Components/EventPosterCard";
import { EmptyState, Surface } from "@/Components/ui/PageShell";

const Hero = () => {
  const { userDetails, isLoggedIn } = useSelector((state) => state.user);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const isOrganizer = isLoggedIn && userDetails?.roles?.includes("ORGANIZER");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "https://bookingapp-backend-hsy3.onrender.com/User/getAllEvents",
          { withCredentials: true }
        );
        setEvents(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const scrollByCards = (direction) => {
    scrollContainerRef.current?.scrollBy({ left: direction * 320, behavior: "smooth" });
  };

  return (
    <div className="pb-20 pt-16">
      <section className="relative overflow-hidden border-b border-[color:var(--border)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(225,29,72,0.12),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(17,24,39,0.06),transparent_30%),linear-gradient(135deg,#fffdfb,#f8f4ef_55%,#fff1f3)]" />
        <div className="page-shell relative grid gap-10 py-12 md:grid-cols-[1.15fr_0.85fr] md:items-center md:py-16">
          <div className="fade-up max-w-xl">
            <p className="section-kicker">EventSphere</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] text-ink md:text-6xl">
              Book the show.<br />Own the seat.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600 md:text-lg">
              A cleaner ticket marketplace for discovering events, choosing seats, and walking in with your booking ready.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to={isLoggedIn ? "/book-events" : "/login"} className="brand-btn">
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
                <div key={item.label} className="rounded-xl bg-[#faf7f3] px-3 py-4 text-center">
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
              <div key={index} className="h-[22rem] w-44 shrink-0 animate-pulse rounded-2xl bg-white/70" />
            ))}
          </div>
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
              className="absolute -left-3 top-[42%] z-10 hidden rounded-full border-[color:var(--border)] bg-white shadow-md md:inline-flex"
              onClick={() => scrollByCards(-1)}
              aria-label="Scroll events left"
            >
              <ChevronLeft />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute -right-3 top-[42%] z-10 hidden rounded-full border-[color:var(--border)] bg-white shadow-md md:inline-flex"
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
