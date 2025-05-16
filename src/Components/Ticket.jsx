import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";

const Ticket = () => {
  const { bookingId } = useParams();
  const [ticket, setTicket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await axios.get(
          `https://bookingapp-backend-hsy3.onrender.com/User/fetchBookingByBookingId/${bookingId}`,
          { withCredentials: true }
        );
        setTicket(res.data);
      } catch (error) {
        toast.error("Failed to fetch ticket details.");
        navigate("/");
      }
    };

    fetchTicket();
  }, [bookingId, navigate]);

  if (!ticket) {
    return <p className="text-center mt-20 text-lg text-gray-600">Loading ticket details...</p>;
  }

  const {
    bookingId: id,
    bookedSeats,
    amountPaid,
    eventId,
    userId
  } = ticket;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 mt-20">
      <Card className="max-w-3xl w-full rounded-2xl shadow-xl border border-gray-200 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-2xl p-6">
          <CardTitle className="text-3xl font-bold tracking-wide">🎫 Ticket Confirmation</CardTitle>
          <p className="text-sm mt-1 opacity-90">Please bring this to the event for verification.</p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between flex-wrap">
            <div className="mb-2">
              <h3 className="text-xl font-semibold text-gray-800">{eventId?.title}</h3>
              <p className="text-sm text-gray-600">
                {new Date(eventId?.startTime).toLocaleString()} – {new Date(eventId?.endTime).toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Booking ID</p>
              <p className="text-sm font-mono text-blue-700 bg-gray-100 px-2 py-1 rounded">{id}</p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-gray-500 mb-1">Booked Seats</p>
            <div className="flex flex-wrap gap-2">
              {bookedSeats.map((seat, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-base font-medium text-gray-700">{userId?.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium text-gray-700">{userId?.email}</p>
            </div>
          </div>

          <Separator />

          <div className="text-center">
            <p className="text-gray-500 text-sm">Amount Paid</p>
            <p className="text-3xl font-bold text-green-600">₹{amountPaid}</p>
          </div>

          <Button
            onClick={() => navigate("/")}
            className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700"
          >
            Go to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ticket;
