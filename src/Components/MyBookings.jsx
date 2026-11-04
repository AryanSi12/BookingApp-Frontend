import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBookingByUserId } from "@/services/bookings";
import { Skeleton } from "@/Components/ui/skeleton";
import { toast } from "sonner";
import { EmptyState, ErrorState, PageHeader, PageShell, Surface } from "@/Components/ui/PageShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { formatEventWhen, parseEventDate } from "@/lib/utils";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetchBookingByUserId();
        setBookings(Array.isArray(res.data) ? res.data : []);
        setFailed(false);
      } catch {
        setFailed(true);
        toast.error("Failed to fetch your bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Bookings have no cancelled status. Upcoming means the event end is still ahead.
  const isUpcoming = (endTime) => {
    const end = parseEventDate(endTime);
    return end ? end > new Date() : false;
  };

  const renderBooking = (booking) => {
    const upcoming = isUpcoming(booking.eventId?.endTime);
    const venue = booking.eventId?.venueId;
    return (
      <Surface key={booking.bookingId} className="overflow-hidden">
        <div className="flex items-start justify-between gap-3 border-b border-dashed border-border px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate font-display text-xl font-bold text-ink">{booking.eventId?.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{formatEventWhen(booking.eventId?.startTime)}</p>
            {(venue?.venueName || venue?.venueLocation) && (
              <p className="text-sm text-muted-foreground">
                {venue?.venueName}{venue?.venueLocation ? ` · ${venue.venueLocation}` : ""}
              </p>
            )}
          </div>
          <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${upcoming ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>
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
              <p className="font-mono text-[11px] text-muted-foreground">{booking.bookingId}</p>
              <p className="font-display text-xl font-bold text-ink">₹{booking.amountPaid}</p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/ticket/${booking.bookingId}`)}
              className="brand-btn h-11"
            >
              View ticket
            </button>
          </div>
        </div>
      </Surface>
    );
  };

  return (
    <PageShell narrow>
      <PageHeader
        kicker="Account"
        title="My bookings"
        subtitle="Tickets you have already paid for, split into upcoming and past."
      />

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : failed ? (
        <ErrorState
          title="Bookings could not be loaded"
          description="Your ticket list did not come back. Try again once you are signed in."
          onRetry={() => window.location.reload()}
        />
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
        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          {["upcoming", "past", "all"].map((tab) => {
            const visible = bookings.filter((booking) => {
              const upcoming = isUpcoming(booking.eventId?.endTime);
              if (tab === "upcoming") return upcoming;
              if (tab === "past") return !upcoming;
              return true;
            });
            return (
              <TabsContent key={tab} value={tab} className="mt-4 space-y-4">
                {visible.length === 0 ? (
                  <EmptyState
                    title={tab === "past" ? "No past tickets" : "Nothing upcoming"}
                    description="Tickets land here after a successful payment."
                  />
                ) : visible.map((booking) => renderBooking(booking))}
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </PageShell>
  );
};

export default MyBookings;
