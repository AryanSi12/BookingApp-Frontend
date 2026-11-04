import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBookingByUserId } from "@/services/bookings";
import { Skeleton } from "@/Components/ui/skeleton";
import { toast } from "sonner";
import { EmptyState, PageHeader, PageShell, Surface } from "@/Components/ui/PageShell";
import { formatEventWhen, parseEventDate } from "@/lib/utils";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetchBookingByUserId();
        setBookings(Array.isArray(res.data) ? res.data : []);
      } catch {
        toast.error("Failed to fetch your bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const isUpcoming = (endTime) => {
    const end = parseEventDate(endTime);
    return end ? end > new Date() : false;
  };

  return (
    <PageShell narrow>
      <PageHeader
        kicker="Account"
        title="My bookings"
        subtitle="Tickets you have already paid for, ready to revisit anytime."
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          title="No bookings yet"
          description="Explore events and grab seats before they fill up."
          action={
            <button type="button" onClick={() => navigate("/book-events")} className="brand-btn">
              Browse events
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const upcoming = isUpcoming(booking.eventId?.endTime);
            const venue = booking.eventId?.venueId;
            return (
              <Surface key={booking.bookingId} className="overflow-hidden">
                <div className="flex items-start justify-between gap-3 border-b border-dashed border-[color:var(--border)] px-5 py-4">
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-xl font-bold text-ink">{booking.eventId?.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{formatEventWhen(booking.eventId?.startTime)}</p>
                    {(venue?.venueName || venue?.venueLocation) && (
                      <p className="text-sm text-slate-500">
                        {venue?.venueName}{venue?.venueLocation ? ` · ${venue.venueLocation}` : ""}
                      </p>
                    )}
                  </div>
                  <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${upcoming ? "bg-emerald-50 text-emerald-700" : "bg-[#f3efe9] text-slate-500"}`}>
                    {upcoming ? "Upcoming" : "Past"}
                  </span>
                </div>
                <div className="space-y-4 px-5 py-4">
                  <div className="flex flex-wrap gap-2">
                    {(booking.bookedSeats || []).map((seat) => (
                      <span key={seat} className="chip">{seat}</span>
                    ))}
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] text-slate-400">{booking.bookingId}</p>
                      <p className="font-display text-xl font-bold text-ink">₹{booking.amountPaid}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/ticket/${booking.bookingId}`)}
                      className="brand-btn h-10"
                    >
                      View ticket
                    </button>
                  </div>
                </div>
              </Surface>
            );
          })}
        </div>
      )}
    </PageShell>
  );
};

export default MyBookings;
