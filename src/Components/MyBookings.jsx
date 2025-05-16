import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";
import { toast } from "sonner";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("https://bookingapp-backend-hsy3.onrender.com/User/fetchBookingByUserId", {
          withCredentials: true,
        });
        setBookings(res.data);
      } catch (error) {
        toast.error("Failed to fetch your bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const isUpcoming = (endTime) => {
    return new Date(endTime) > new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen mt-24 px-6 lg:px-12">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">🎟️ My Bookings</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-2xl shadow-lg border border-blue-300 p-4 space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full mt-4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-1/3 mt-4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen mt-20 flex flex-col items-center justify-center text-center px-4">
        <p className="text-lg text-gray-600">You haven’t made any bookings yet.</p>
        <Button className="mt-6" onClick={() => navigate("/")}>
          Explore Events
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-24 px-6 lg:px-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">🎟️ My Bookings</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
        {bookings.map((booking) => (
          <Card
            key={booking.bookingId}
            className="rounded-2xl shadow-lg border border-blue-300"
          >
            <CardHeader className="bg-blue-100 p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-blue-800">
                  {booking.eventId?.title}
                </CardTitle>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    isUpcoming(booking.eventId?.endTime)
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {isUpcoming(booking.eventId?.endTime) ? "Upcoming" : "Expired"}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-1">
                {new Date(booking.eventId?.startTime).toLocaleString()} -{" "}
                {new Date(booking.eventId?.endTime).toLocaleString()}
              </p>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Booking ID: </span>
                <span className="font-mono">{booking.bookingId}</span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Booked Seats:</p>
                <div className="flex flex-wrap gap-2">
                  {booking.bookedSeats.map((seat, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-200 text-blue-900 px-2 py-1 rounded-full text-sm"
                    >
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{booking.userId?.username}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{booking.userId?.email}</p>
                </div>
              </div>

              <Separator />

              <div className="text-center">
                <p className="text-gray-600 text-sm">Amount Paid</p>
                <p className="text-xl font-bold text-green-600">₹{booking.amountPaid}</p>
              </div>

              <Button
                onClick={() => navigate(`/ticket/${booking.bookingId}`)}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 mt-4"
              >
                View Ticket
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
