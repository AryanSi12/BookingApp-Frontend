import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/Components/ui/skeleton";
import { EmptyState, PageHeader, PageShell, Surface } from "@/Components/ui/PageShell";

const CreateEvent = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get("https://bookingapp-backend-hsy3.onrender.com/User/getAllVenues", {
          withCredentials: true,
        });
        setVenues(response.data || []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch venues");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  return (
    <PageShell>
      <PageHeader
        kicker="Organizer"
        title="Choose a venue"
        subtitle="Pick a hall layout, then finish the event details."
      />

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
      ) : venues.length === 0 ? (
        <EmptyState
          title="No venues yet"
          description="Create a venue first so you can attach a seat map to your event."
          action={
            <button type="button" className="brand-btn" onClick={() => navigate("/create-venue")}>
              Create venue
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => {
            const venueId = venue.venueId;
            return (
              <button
                key={venueId}
                type="button"
                onClick={() => navigate(`/create-event-final/${venueId}`)}
                className="text-left"
              >
                <Surface className="overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(17,24,39,0.08)]">
                  <img
                    src={venue.venueImage}
                    alt={venue.venueName}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-ink">{venue.venueName}</h3>
                    <p className="mt-1 text-sm text-slate-500">{venue.venueLocation}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {venue.rows} rows × {venue.col} seats
                    </p>
                  </div>
                </Surface>
              </button>
            );
          })}
        </div>
      )}
    </PageShell>
  );
};

export default CreateEvent;
