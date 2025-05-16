import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";

import { Link } from "react-router-dom";

const arrayToDate = (arr) => new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]);

const BookAnEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8092/User/getAllEvents", {
          withCredentials: true,
        });
        console.log(res.data);
        
        setEvents(res.data);
      } catch (error) {
        toast.error("Failed to fetch bookable events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen mt-24 px-6 lg:px-12 bg-white">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-green-800 tracking-wide">
          🎟️ Book an Event
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="rounded-3xl shadow-xl border border-green-200 p-6 space-y-6 animate-pulse"
            >
              <Skeleton className="h-56 w-full rounded-2xl" />
              <Skeleton className="h-8 w-3/5 rounded-md" />
              <Skeleton className="h-5 w-4/5 rounded-md" />
              <Skeleton className="h-5 w-full rounded-md mt-6" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="min-h-screen mt-28 flex flex-col items-center justify-center text-center px-6 bg-white">
        <p className="text-xl text-gray-500 font-medium">
          No events available to book at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-28 px-8 lg:px-24 ">
      <h2 className="text-4xl  font-extrabold mb-12 text-center text-slate-200 tracking-wide">
    Book an Event
      </h2>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const start = arrayToDate(event.startTime);
          const end = arrayToDate(event.endTime);
          const price = event.ticketPrice || 50; // fallback example price

          return (
            <Link
              to={`/event/${event.eventId}`}
              key={event.eventId}
              className="transform transition duration-300 hover:scale-[1.02] hover:shadow-xl rounded-3xl"
            >
              <Card className="rounded-3xl shadow-md border border-green-300 overflow-hidden bg-white">
                {event.eventImage && (
                  <img
                    src={event.eventImage}
                    alt={event.title}
                    className="w-full h-56 object-cover rounded-t-3xl"
                    loading="lazy"
                  />
                )}
                <CardHeader className="bg-green-50 p-6">
                  <CardTitle className="text-2xl font-semibold text-green-900 tracking-tight">
                    {event.title}
                  </CardTitle>
                  <p className="text-sm text-gray-700 mt-1 font-medium">
                    {start.toLocaleDateString()} | {start.toLocaleTimeString()} - {end.toLocaleTimeString()}
                  </p>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Venue:</span> {event.venueId?.venueName || "TBD"}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Location:</span> {event.venueId?.venueLocation || "TBD"}
                  </p>
                  <p className="text-gray-700 text-sm">
                    <span className="font-semibold">Organizer:</span> {event.organizerId?.username || "TBD"}
                  </p>
                  <p className="text-lg font-bold text-green-700 mt-3">Starting at ₹ {price} / ticket</p>
                  <Button className="w-full mt-2" variant="outline">
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BookAnEvent;
