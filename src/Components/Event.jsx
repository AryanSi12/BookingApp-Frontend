import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const categoryColors = {
  VIP: "bg-yellow-400",
  REGULAR: "bg-blue-400",
};

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
        const eventRes = await axios.get(`http://localhost:8092/User/getEventById/${eventId}`, {
          withCredentials: true,
        });
        const eventData = eventRes.data;
        setEvent(eventData);

        const venueId = eventData.venueId.venueId;
        const venueRes = await axios.get(`http://localhost:8092/User/getVenueById/${venueId}`, {
          withCredentials: true,
        });
        const venueData = venueRes.data.venue || venueRes.data;
        setVenue(venueData);

        const seatRes = await axios.get(`http://localhost:8092/User/getSeatStatusByEventId/${eventId}`, {
          withCredentials: true,
        });
        setSeatStatusList(seatRes.data);
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
    if (seat.status !== "AVAILABLE") return;

    const isSelected = selectedSeats.find((s) => s.seatNumber === seat.seatNumber);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatNumber !== seat.seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => {
    return seat.seatType === "VIP" ? sum + 100 : sum + 50;
  }, 0);

  const handleBook = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat to book.");
      return;
    }

    const seatNumbers = selectedSeats.map((seat) => seat.seatNumber);
    navigate(`/booking/${eventId}`, {
      state: {
        bookedSeats: seatNumbers,
      },
    });
  };

  if (!event || !venue) return <div className="text-white text-center mt-16">Loading event...</div>;

  return (
    <div className="min-h-screen mt-5 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Event Card */}
        <Card className="bg-white text-gray-900 rounded-2xl shadow-xl">
          <img src={event.eventImage} alt={event.title} className="w-full h-80 object-cover rounded-t-2xl" />
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-indigo-700">
              {event.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-slate-700 space-y-2">
            <p>{event.aboutEvent}</p>
            <p><span className="font-semibold">Start:</span> {new Date(event.startTime).toLocaleString()}</p>
            <p><span className="font-semibold">End:</span> {new Date(event.endTime).toLocaleString()}</p>
            <p><span className="font-semibold">Venue:</span> {venue.venueName}, {venue.venueLocation}</p>
          </CardContent>
        </Card>

        {/* Seat Layout */}
        <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-center text-purple-700">Seat Layout</h2>
          <div className="text-center mb-6">
            <div className="bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-t-lg w-fit mx-auto shadow-md">
              SCREEN
            </div>
          </div>

          <div
            className="grid"
            style={{
              gridTemplateRows: `repeat(${venue.rows}, auto)`,
              gridTemplateColumns: `repeat(${venue.col}, 1fr)`,
              gap: "10px",
            }}
          >
            {loadingSeats ? (
              Array.from({ length: venue.rows * venue.col }).map((_, index) => (
                <Skeleton key={index} className="h-10 rounded-lg" />
              ))
            ) : (
              seatStatusList.map((seat) => {
                const isSelected = selectedSeats.find((s) => s.seatNumber === seat.seatNumber);
                let bgColor = "";

                if (seat.status === "BOOKED") {
                  bgColor = "bg-gray-500";
                } else if (isSelected) {
                  bgColor = "bg-green-500";
                } else {
                  bgColor = categoryColors[seat.seatType] || "bg-gray-400";
                }

                return (
                  <div
                    key={seat.seatStatusId}
                    onClick={() => toggleSeatSelection(seat)}
                    className={`h-10 flex items-center justify-center rounded-lg text-sm font-medium text-white 
                      ${bgColor} 
                      ${seat.status !== "AVAILABLE" ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {seat.seatNumber}
                  </div>
                );
              })
            )}
          </div>

          {/* Legends */}
          <div className="mt-6 flex justify-center gap-4 flex-wrap text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-yellow-400"></span> VIP (₹100)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-blue-400"></span> REGULAR (₹50)
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-gray-500"></span> BOOKED
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-green-500"></span> SELECTED
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="text-center space-y-4">
          <p className="text-lg">
            Selected Seats: <span className="font-bold">{selectedSeats.map((s) => s.seatNumber).join(", ") || "None"}</span>
          </p>
          <p className="text-lg">
            Total Price: <span className="font-bold">₹{totalPrice}</span>
          </p>
          <Button
            className="bg-purple-700 text-white hover:bg-purple-800 px-6 py-2 rounded-lg text-md"
            onClick={handleBook}
          >
            Book Tickets
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Event;
