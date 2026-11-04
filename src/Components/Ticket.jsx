import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { fetchBookingByBookingId } from "@/services/bookings";
import { PageShell } from "@/Components/ui/PageShell";
import { formatEventWhen } from "@/lib/utils";

const Ticket = () => {
  const { bookingId } = useParams();
  const [ticket, setTicket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetchBookingByBookingId(bookingId);
        setTicket(res.data);
      } catch {
        toast.error("Failed to fetch ticket details.");
        navigate("/");
      }
    };

    fetchTicket();
  }, [bookingId, navigate]);

  if (!ticket) {
    return <p className="px-4 pt-28 text-center text-slate-500">Loading ticket details...</p>;
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

  return (
    <PageShell>
      <div className="mx-auto max-w-md fade-up">
        <article className="overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-white shadow-[0_20px_50px_rgba(17,24,39,0.08)]">
          <header className="relative overflow-hidden bg-brand-gradient px-6 py-6 text-white">
            <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">EventSphere ticket</p>
            <h1 className="mt-2 font-display text-2xl font-bold leading-tight">{eventId?.title || "Your ticket"}</h1>
            <p className="mt-2 text-sm text-white/90">{formatEventWhen(eventId?.startTime)}</p>
          </header>

          <div className="relative border-b border-dashed border-[color:var(--border)] px-6 py-5">
            <span className="absolute -left-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-[color:var(--paper)]" />
            <span className="absolute -right-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-[color:var(--paper)]" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Venue</p>
                <p className="mt-1 font-semibold text-ink">{venueName || "See event details"}</p>
                {venueLocation && <p className="text-xs text-slate-500">{venueLocation}</p>}
              </div>
              <div className="text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Booking ID</p>
                <p className="mt-1 break-all font-mono text-[11px] font-semibold text-slate-700">{id}</p>
              </div>
            </div>
          </div>

          <div className="space-y-5 px-6 py-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Seats</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {bookedSeats.map((seat) => (
                  <span key={seat} className="chip">{seat}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Name</p>
                <p className="mt-1 font-semibold text-ink">{userId?.username}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Email</p>
                <p className="mt-1 break-all font-medium text-slate-700">{userId?.email}</p>
              </div>
            </div>

            <div className="flex items-end justify-between border-t border-[color:var(--border)] pt-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Amount paid</p>
                <p className="font-display text-3xl font-bold text-ink">₹{amountPaid}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/my-bookings")}
                className="brand-btn h-10"
              >
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
