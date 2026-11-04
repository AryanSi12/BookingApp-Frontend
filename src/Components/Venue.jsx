import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getVenueById } from "@/services/venues";
import SeatMap from "@/Components/SeatMap";
import { ErrorState, PageShell, Surface } from "@/Components/ui/PageShell";

const Venue = () => {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [failed, setFailed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const fetchVenue = async () => {
      setFailed(false);
      try {
        const response = await getVenueById(venueId);
        const next = response.data.venue || response.data;
        if (!cancelled) {
          if (!next) setFailed(true);
          else setVenue(next);
        }
      } catch (error) {
        if (!cancelled) setFailed(true);
        toast.error("Error fetching venue details");
        console.error(error);
      }
    };

    fetchVenue();
    return () => {
      cancelled = true;
    };
  }, [venueId]);

  if (failed) {
    return (
      <PageShell>
        <ErrorState title="Venue unavailable" description="This hall could not be loaded." />
      </PageShell>
    );
  }

  if (!venue) {
    return <div className="px-4 pt-28 text-center text-muted-foreground">Loading venue details...</div>;
  }

  const seatCount = Array.isArray(venue.seats) ? venue.seats.length : (venue.rows || 0) * (venue.col || 0);

  return (
    <PageShell>
      <Surface className="fade-up overflow-hidden md:grid md:grid-cols-[280px_1fr]">
        {venue.venueImage && (
          <img src={venue.venueImage} alt="" className="h-56 w-full object-cover md:h-full" />
        )}
        <div className="p-6 md:p-8">
          <p className="section-kicker">Venue</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-ink">{venue.venueName}</h1>
          <p className="mt-2 text-sm text-slate-600">{venue.venueLocation}</p>
          <p className="mt-4 text-sm text-slate-500">{seatCount} seats · {venue.rows} rows × {venue.col} seats</p>
          <button
            type="button"
            onClick={() => navigate(`/create-event-final/${venue.venueId}`)}
            className="brand-btn mt-6"
          >
            Create event
          </button>
        </div>
      </Surface>

      <section className="mt-8">
        <div className="mb-4">
          <p className="section-kicker">Layout</p>
          <h2 className="mt-1 font-display text-2xl font-bold text-ink">Hall preview</h2>
        </div>
        <SeatMap seats={venue.seats || []} cols={venue.col} interactive={false} />
      </section>
    </PageShell>
  );
};

export default Venue;
