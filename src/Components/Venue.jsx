import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";

const categoryColors = {
  VIP: "bg-yellow-400",
  REGULAR: "bg-blue-400",
};

const Venue = () => {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const navigate = useNavigate();

  const handleClick = () => {
    console.log(venue.venueId);
    
    navigate(`/create-event-final/${venue.venueId}`); // change to your target route
  };
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await axios.get(`https://bookingapp-backend-hsy3.onrender.com/User/getVenueById/${venueId}`, {
          withCredentials: true,
        });
        console.log(response.data);
        
        setVenue(response.data); // fallback for raw object
      } catch (error) {
        toast.error("Error fetching venue details");
        console.error(error);
      }
    };

    fetchVenue();
  }, [venueId]);

  if (!venue) return <div className="text-white text-center mt-16">Loading venue details...</div>;

  return (
    <div className="min-h-screen mt-5 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        <Card className="bg-white text-gray-900 rounded-2xl shadow-xl">
          <img src={venue.venueImage} alt={venue.venueName} className="w-full h-80 object-cover rounded-t-2xl" />
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-indigo-700">
              {venue.venueName} — {venue.venueLocation}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-6 text-center text-slate-700">
              Seats: {venue.rows * venue.col}
            </div>
          </CardContent>
        </Card>

        <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-center text-purple-700">Seat Layout</h2>
          <div
            className="grid"
            style={{
              gridTemplateRows: `repeat(${venue.rows}, auto)`,
              gridTemplateColumns: `repeat(${venue.col}, 1fr)`,
              gap: "10px",
            }}
          >
            {venue.seats.map((seat) => (
              <div
                key={seat._id}
                className={`h-10 flex items-center justify-center rounded-lg text-sm font-medium text-white ${
                  categoryColors[seat.seatType] || "bg-gray-400"
                }`}
              >
                {seat.seatNumber}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center gap-4 flex-wrap text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-yellow-400"></span>
              VIP
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded bg-blue-400"></span>
              REGULAR
            </div>
          </div>
        </div>

        {/* Create Event Button */}
        <div className="flex justify-center pt-4">
          <Button
            className="bg-purple-700 text-white hover:bg-purple-800 px-6 py-2 rounded-lg text-md"
            onClick={handleClick}
          >
            Create Event
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Venue;
