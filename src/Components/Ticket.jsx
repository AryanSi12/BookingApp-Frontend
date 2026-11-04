import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { fetchBookingByBookingId } from "@/services/bookings";
import { ErrorState, PageShell } from "@/Components/ui/PageShell";
import { formatEventWhen } from "@/lib/utils";
import { downloadIcs } from "@/lib/ics";
import { fireConfetti } from "@/lib/confetti";

const Ticket = () => {
  const { bookingId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [failed, setFailed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const fetchTicket = async () => {
      try {
        const res = await fetchBookingByBookingId(bookingId);
        if (!cancelled) setTicket(res.data);
      } catch {
        if (!cancelled) {
          setFailed(true);
          toast.error("Failed to fetch ticket details.");
        }
      }
    };

    fetchTicket();
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  useEffect(() => {
    if (!ticket?.bookingId) return;
    const key = `confetti:${ticket.bookingId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fireConfetti();
  }, [ticket]);

  if (failed) {
    return (
      <PageShell narrow>
        <ErrorState
          title="Ticket unavailable"
          description="This booking could not be loaded."
          action={
            <button type="button" onClick={() => navigate("/my-bookings")} className="ghost-btn">
              My bookings
            </button>
          }
        />
      </PageShell>
    );
  }

  if (!ticket) {
    return <p className="px-4 pt-28 text-center text-muted-foreground">Loading ticket details...</p>;
  }

  const {
    bookingId: id,
    bookedSeats = [],
    amountPaid,
    eventId,
    userId
  } = ticket;

  const venueName = eventId?.venueId?.venueName;
  const venueLocation = eventId?.venueId?.venueLocation;

  const saveCalendar = () => {
    downloadIcs({
      title: eventId?.title,
      start: eventId?.startTime,
      end: eventId?.endTime,
      location: [venueName, venueLocation].filter(Boolean).join(", "),
      description: `Booking ${id}. Seats: ${bookedSeats.join(", ")}`,
    }, `event-${id || "ticket"}.ics`);
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-md fade-up">
        <article className="ticket-sheet overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-card">
          <header className="relative overflow-hidden bg-brand-gradient px-6 py-6 text-white">
            <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">EventSphere ticket</p>
            <h1 className="mt-2 font-display text-2xl font-bold leading-tight">{eventId?.title || "Your ticket"}</h1>
            <p className="mt-2 text-sm text-white/90">{formatEventWhen(eventId?.startTime)}</p>
          </header>

          <div className="relative border-b border-dashed border-border px-6 py-5">
            <span className="absolute -left-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
            <span className="absolute -right-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Venue</p>
                <p className="mt-1 font-semibold text-ink">{venueName || "See event details"}</p>
                {venueLocation && <p className="text-xs text-muted-foreground">{venueLocation}</p>}
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Booking ID</p>
                <p className="mt-1 break-all font-mono text-[11px] font-semibold text-foreground">{id}</p>
              </div>
            </div>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div className="flex justify-center rounded-2xl bg-white p-4">
              <QRCodeSVG value={String(id || bookingId)} size={148} includeMargin={false} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Seats</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {bookedSeats.map((seat) => (
                  <span key={seat} className="chip">{seat}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Name</p>
                <p className="mt-1 font-semibold text-ink">{userId?.username}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Email</p>
                <p className="mt-1 break-all font-medium text-foreground">{userId?.email}</p>
              </div>
            </div>

            <div className="flex items-end justify-between border-t border-border pt-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Amount paid</p>
                <p className="font-display text-3xl font-bold text-ink">₹{amountPaid}</p>
              </div>
            </div>
            <div className="no-print flex flex-wrap gap-2">
              <button type="button" onClick={() => window.print()} className="ghost-btn h-11 flex-1">
                Print
              </button>
              <button type="button" onClick={saveCalendar} className="ghost-btn h-11 flex-1">
                Add to calendar
              </button>
              <button type="button" onClick={() => navigate("/my-bookings")} className="brand-btn h-11 flex-1">
                My bookings
              </button>
            </div>
          </div>
        </article>
      </div>
    </PageShell>
  );
};

export default Ticket;
