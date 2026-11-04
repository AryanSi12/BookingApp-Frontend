import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { cn, formatEventDay, fromPrice } from "@/lib/utils";

const EventPosterCard = ({ event, className = "", variant = "poster" }) => {
  const venueName = event.venueId?.venueName || "Venue TBA";
  const location = event.venueId?.venueLocation;
  const wide = variant === "wide";

  return (
    <Link
      to={`/event/${event.eventId}`}
      className={cn("group block", className)}
    >
      <article className="overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className={cn("relative overflow-hidden bg-muted", wide ? "aspect-[16/10]" : "aspect-[3/4]")}>
          {event.eventImage ? (
            <img
              src={event.eventImage}
              alt=""
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-sm text-muted-foreground">
              {event.title}
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
          <span className="absolute left-3 top-3 rounded-lg bg-card/95 px-2.5 py-1 text-[11px] font-bold tracking-wide text-ink shadow-sm backdrop-blur">
            {formatEventDay(event.startTime)}
          </span>
        </div>
        <div className="space-y-2 p-3.5">
          <h3 className="line-clamp-2 min-h-[2.5rem] font-display text-sm font-semibold leading-snug text-ink" title={event.title}>
            {event.title}
          </h3>
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
            <span className="line-clamp-1">{venueName}{location ? ` · ${location}` : ""}</span>
          </p>
          <div className="flex items-center justify-between pt-1">
            <p className="text-sm font-bold text-primary">From ₹{fromPrice(event)}</p>
            <span className="text-[11px] font-semibold text-muted-foreground transition group-hover:text-primary">Book →</span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default EventPosterCard;
