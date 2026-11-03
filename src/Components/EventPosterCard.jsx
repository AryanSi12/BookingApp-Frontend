import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { formatEventDay, fromPrice } from "@/lib/utils";

const EventPosterCard = ({ event, className = "" }) => {
  const venueName = event.venueId?.venueName || "Venue TBA";
  const location = event.venueId?.venueLocation;

  return (
    <Link
      to={`/event/${event.eventId}`}
      className={`group block ${className}`}
    >
      <article className="overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-[0_8px_24px_rgba(17,24,39,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#efeae4]">
          {event.eventImage ? (
            <img
              src={event.eventImage}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-slate-500">
              {event.title}
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
          <span className="absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-bold tracking-wide text-ink shadow-sm backdrop-blur">
            {formatEventDay(event.startTime)}
          </span>
        </div>
        <div className="space-y-2 p-3.5">
          <h3 className="line-clamp-2 min-h-[2.5rem] font-display text-sm font-semibold leading-snug text-ink" title={event.title}>
            {event.title}
          </h3>
          <p className="flex items-start gap-1.5 text-xs text-slate-500">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand/70" />
            <span className="line-clamp-1">{venueName}{location ? ` · ${location}` : ""}</span>
          </p>
          <div className="flex items-center justify-between pt-1">
            <p className="text-sm font-bold text-brand">From ₹{fromPrice(event)}</p>
            <span className="text-[11px] font-semibold text-slate-400 transition group-hover:text-brand">Book →</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default EventPosterCard;
