import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Link } from "react-router-dom"; // <-- React Router Link

const arrayToDate = (arr) => {
  return new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4]);
};

const GetAllEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8092/User/getAllEvents", {
          withCredentials: true,
        });
        setEvents(res.data);
      } catch (error) {
        toast.error("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen mt-24 px-6 lg:px-12 bg-white">
        <h2 className="text-4xl font-extrabold mb-10 text-center text-blue-800 tracking-wide">
          📅 All Events
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="rounded-3xl shadow-xl border border-blue-200 p-6 space-y-6 animate-pulse"
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
          No events available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-24 px-8 lg:px-24 ">
      <h2 className="text-4xl font-extrabold mb-15 text-center text-slate-100  tracking-wider">
        📅 All Events
      </h2>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => {
          const start = arrayToDate(event.startTime);
          const end = arrayToDate(event.endTime);

          return (
            <Link
              to={`/event/${event.eventId}`}
              key={event.eventId}
              className="transform transition duration-300 hover:scale-[1.03] hover:shadow-2xl rounded-3xl"
            >
              <Card className="rounded-3xl shadow-lg border border-blue-300 overflow-hidden cursor-pointer bg-white">
                {event.eventImage && (
                  <img
                    src={event.eventImage}
                    alt={event.title}
                    className="w-full h-56 object-cover rounded-t-3xl"
                    loading="lazy"
                  />
                )}
                <CardHeader className="bg-blue-50 p-6 rounded-b-none">
                  <CardTitle className="text-2xl font-semibold text-blue-900 tracking-tight">
                    {event.title}
                  </CardTitle>
                  <p className="text-md text-gray-700 mt-2 font-medium">
                    {start.toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}{" "}
                    -{" "}
                    {end.toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  <p className="text-gray-700 text-base leading-relaxed">
                    {event.aboutEvent || "No description provided."}
                  </p>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-semibold">Organizer: </span>
                      {event.organizerId?.username || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Venue: </span>
                      {event.venueId?.venueName || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Location: </span>
                      {event.venueId?.venueLocation || "N/A"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default GetAllEvents;
