import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from "@stripe/react-stripe-js";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageShell, Surface } from "@/Components/ui/PageShell";
import { formatEventWhen, seatPrice } from "@/lib/utils";

const elementStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#111827",
      fontFamily: "DM Sans, Arial, sans-serif",
      "::placeholder": {
        color: "#94a3b8"
      }
    },
    invalid: {
      color: "#e11d48"
    }
  }
};

const Booking = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const {
    bookedSeats = [],
    selectedSeatDetails = [],
    totalPrice,
    eventTitle,
    eventImage,
    startTime,
    venueName,
    venueLocation,
  } = location.state || {};

  const [summary, setSummary] = useState({
    title: eventTitle,
    image: eventImage,
    startTime,
    venueName,
    venueLocation,
    total: totalPrice,
  });

  useEffect(() => {
    if (eventTitle && totalPrice != null) return;

    const loadSummary = async () => {
      try {
        const eventRes = await axios.get(
          `https://bookingapp-backend-hsy3.onrender.com/User/getEventById/${eventId}`,
          { withCredentials: true }
        );
        const eventData = eventRes.data;
        const venueRef = eventData.venueId;
        let nextTotal = totalPrice;
        if (nextTotal == null) {
          if (selectedSeatDetails.length) {
            nextTotal = selectedSeatDetails.reduce((sum, seat) => sum + seatPrice(seat.seatType), 0);
          } else if (bookedSeats.length) {
            const seatRes = await axios.get(
              `https://bookingapp-backend-hsy3.onrender.com/User/getSeatStatusByEventId/${eventId}`,
              { withCredentials: true }
            );
            const byNumber = new Map((seatRes.data || []).map((seat) => [String(seat.seatNumber), seat]));
            nextTotal = bookedSeats.reduce((sum, number) => sum + seatPrice(byNumber.get(String(number))?.seatType), 0);
          }
        }
        setSummary({
          title: eventData.title,
          image: eventData.eventImage,
          startTime: eventData.startTime,
          venueName: typeof venueRef === "object" ? venueRef.venueName : venueName,
          venueLocation: typeof venueRef === "object" ? venueRef.venueLocation : venueLocation,
          total: nextTotal ?? 0,
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (bookedSeats.length) loadSummary();
  }, [bookedSeats, eventId, eventTitle, selectedSeatDetails, totalPrice, venueLocation, venueName]);

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      const res = await axios.post(
        `https://bookingapp-backend-hsy3.onrender.com/User/bookSeat/${eventId}`,
        { bookedSeats },
        { withCredentials: true }
      );

      const { clientSecret, bookingDetails } = res.data;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement)
        }
      });

      if (result.error) {
        toast.error(result.error.message || "Payment failed");
        navigate(`/event/${eventId}`);
      } else {
        toast.success("Booking successful!");
        navigate(`/ticket/${bookingDetails.bookingId}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during payment.");
      navigate(`/event/${eventId}`);
    }

    setLoading(false);
  };

  if (!bookedSeats.length) {
    return (
      <PageShell narrow>
        <Surface className="px-6 py-14 text-center">
          <h1 className="font-display text-2xl font-bold text-ink">Select seats first</h1>
          <p className="mt-2 text-sm text-slate-500">Your checkout needs at least one seat from the hall map.</p>
          <button type="button" onClick={() => navigate(`/event/${eventId}`)} className="brand-btn mt-6">
            Choose seats
          </button>
        </Surface>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mb-8 fade-up">
        <p className="section-kicker">Checkout</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">Confirm and pay</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <aside className="surface-card fade-up h-fit overflow-hidden">
          <div className="border-b border-[color:var(--border)] bg-[#faf7f3] px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Order summary</p>
          </div>
          <div className="p-5">
            <div className="flex gap-4">
              {summary.image && (
                <img src={summary.image} alt="" className="h-28 w-20 rounded-xl object-cover shadow-sm" />
              )}
              <div className="min-w-0">
                <h2 className="font-display text-xl font-bold text-ink">{summary.title || "Your tickets"}</h2>
                <p className="mt-1 text-sm text-slate-500">{formatEventWhen(summary.startTime)}</p>
                {(summary.venueName || summary.venueLocation) && (
                  <p className="mt-1 text-sm text-slate-500">
                    {summary.venueName}{summary.venueLocation ? ` · ${summary.venueLocation}` : ""}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-5 border-t border-dashed border-[color:var(--border)] pt-4">
              <p className="text-sm font-medium text-slate-500">Seats</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {bookedSeats.map((seat) => (
                  <span key={seat} className="chip">{seat}</span>
                ))}
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[color:var(--border)] pt-4">
              <span className="text-sm text-slate-500">{bookedSeats.length} {bookedSeats.length === 1 ? "ticket" : "tickets"}</span>
              <span className="font-display text-2xl font-bold text-ink">₹{summary.total ?? 0}</span>
            </div>
          </div>
        </aside>

        <section className="surface-card fade-up-delay p-6 md:p-8">
          <h2 className="font-display text-xl font-bold text-ink">Pay with card</h2>
          <p className="mt-1 text-sm text-slate-500">Your seats stay reserved until this payment finishes.</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Card number</label>
              <div className="rounded-xl border border-[color:var(--border)] bg-white p-3.5">
                <CardNumberElement options={elementStyle} />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Expiry</label>
                <div className="rounded-xl border border-[color:var(--border)] bg-white p-3.5">
                  <CardExpiryElement options={elementStyle} />
                </div>
              </div>
              <div className="w-1/2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">CVC</label>
                <div className="rounded-xl border border-[color:var(--border)] bg-white p-3.5">
                  <CardCvcElement options={elementStyle} />
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePayment}
            disabled={loading || !stripe}
            className="brand-btn mt-7 w-full"
          >
            {loading ? "Processing..." : `Pay ₹${summary.total ?? 0}`}
          </button>
        </section>
      </div>
    </PageShell>
  );
};

export default Booking;
