import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import { getEventById, getSeatStatusByEventId } from "@/services/events";
import { getVenueById } from "@/services/venues";
import { toast } from "sonner";
import SeatMap from "@/Components/SeatMap";
import { PageShell, Surface } from "@/Components/ui/PageShell";
import { MAX_SEATS, formatEventTime, formatEventWhen, seatPrice } from "@/lib/utils";

const Event = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [venue, setVenue] = useState(null);
  const [seatStatusList, setSeatStatusList] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventRes = await getEventById(eventId);
        const eventData = eventRes.data;
        setEvent(eventData);

        const venueRef = eventData.venueId;
        const venueId = typeof venueRef === "object"
          ? venueRef.venueId || venueRef._id || venueRef.id
          : venueRef;

        if (venueId) {
          const venueRes = await getVenueById(venueId);
          setVenue(venueRes.data.venue || venueRes.data);
        } else if (venueRef && typeof venueRef === "object") {
          setVenue(venueRef);
        }

        const seatRes = await getSeatStatusByEventId(eventId);
        setSeatStatusList(Array.isArray(seatRes.data) ? seatRes.data : []);
      } catch (error) {
        toast.error("Error loading event data");
        console.error(error);
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchData();
  }, [eventId]);

  const toggleSeatSelection = (seat) => {
    if ((seat.status || "AVAILABLE") !== "AVAILABLE") return;

    const alreadySelected = selectedSeats.some((item) => item.seatNumber === seat.seatNumber);
    if (alreadySelected) {
      setSelectedSeats(selectedSeats.filter((item) => item.seatNumber !== seat.seatNumber));
      return;
    }
    if (selectedSeats.length >= MAX_SEATS) {
      toast.error(`You can select up to ${MAX_SEATS} seats.`);
      return;
    }
    setSelectedSeats([...selectedSeats, seat]);
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seatPrice(seat.seatType), 0);

  const handleBook = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat to book.");
      return;
    }

    navigate(`/booking/${eventId}`, {
      state: {
        bookedSeats: selectedSeats.map((seat) => seat.seatNumber),
        selectedSeatDetails: selectedSeats,
        totalPrice,
        eventTitle: event.title,
        eventImage: event.eventImage,
        startTime: event.startTime,
        venueName: venue?.venueName,
        venueLocation: venue?.venueLocation,
      },
    });
  };

  if (!event || !venue) {
    return <div className="px-4 pt-28 text-center text-slate-500">Loading event...</div>;
  }

  const showtime = formatEventTime(event.startTime);

  return (
    <PageShell className="pb-36">
      <Surface className="fade-up overflow-hidden md:grid md:grid-cols-[240px_1fr]">
        <div className="relative min-h-56 bg-[#efeae4] md:min-h-full">
          {event.eventImage ? (
            <img src={event.eventImage} alt="" className="h-full max-h-80 w-full object-cover md:absolute md:inset-0 md:max-h-none" />
          ) : (
            <div className="flex h-56 items-center justify-center text-sm text-slate-400">No poster</div>
          )}
        </div>
        <div className="p-5 md:p-8">
          <p className="section-kicker">Now booking</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-ink md:text-4xl">{event.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
            {event.aboutEvent || "Details for this event will be shared by the organizer."}
          </p>
          <div className="mt-5 flex flex-col gap-2 text-sm text-slate-600">
            <p className="inline-flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-brand" />
              <span>
                <span className="font-semibold text-ink">{venue.venueName}</span>
                {venue.venueLocation ? ` · ${venue.venueLocation}` : ""}
              </span>
            </p>
            <p className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand" />
              {formatEventWhen(event.startTime)}
            </p>
          </div>
          {showtime && (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Showtime</p>
              <span className="inline-flex rounded-xl border border-brand/30 bg-brand-soft px-3.5 py-2 text-sm font-bold text-brand">
                {showtime}
              </span>
            </div>
          )}
        </div>
      </Surface>

      <section className="mt-8">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="section-kicker">Hall</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink">Select your seats</h2>
          </div>
          <p className="text-xs font-medium text-slate-400">
            {loadingSeats ? "Loading layout..." : `${seatStatusList.length} seats`}
          </p>
        </div>
        {loadingSeats ? (
          <Surface className="px-6 py-16 text-center text-sm text-slate-500">
            Loading seat layout...
          </Surface>
        ) : (
          <SeatMap
            seats={seatStatusList}
            cols={venue.col}
            selectedSeats={selectedSeats}
            onToggle={toggleSeatSelection}
            onReplace={setSelectedSeats}
            interactive
          />
        )}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[color:var(--border)] bg-white/90 backdrop-blur-xl">
        <div className="page-shell flex items-center justify-between gap-4 py-3.5">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {selectedSeats.length} {selectedSeats.length === 1 ? "ticket" : "tickets"}
            </p>
            <p className="truncate text-sm font-semibold text-ink">
              {selectedSeats.map((seat) => seat.seatNumber).join(", ") || "No seats selected"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-4">
            <p className="font-display text-xl font-bold text-ink">₹{totalPrice}</p>
            <button type="button" onClick={handleBook} className="brand-btn">
              Proceed
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Event;
