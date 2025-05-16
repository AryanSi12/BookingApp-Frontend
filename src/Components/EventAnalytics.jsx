import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { toast } from "sonner";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, XAxis, YAxis, CartesianGrid, Bar, ResponsiveContainer } from "recharts";

const COLORS = ["#4ade80", "#f87171"]; // Green, Red

const EventAnalytics = () => {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [seatStatusList, setSeatStatusList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const eventRes = await axios.get(`http://localhost:8092/User/getEventById/${eventId}`, {
          withCredentials: true,
        });
        setEvent(eventRes.data);

        const seatRes = await axios.get(`http://localhost:8092/User/getSeatStatusByEventId/${eventId}`, {
          withCredentials: true,
        });
        setSeatStatusList(seatRes.data);
      } catch (err) {
        toast.error("Failed to load event analytics.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [eventId]);

  if (loading) {
    return <div className="text-white text-center mt-16">Loading analytics...</div>;
  }

  if (!event || seatStatusList.length === 0) {
    return <div className="text-white text-center mt-16">No analytics data found.</div>;
  }

  // Analytics Calculations
  const totalSeats = seatStatusList.length;
  const bookedSeats = seatStatusList.filter((s) => s.status === "BOOKED");
  const availableSeats = seatStatusList.filter((s) => s.status === "AVAILABLE");

  const totalRevenue = bookedSeats.reduce((acc, seat) => acc + (seat.seatType === "VIP" ? 100 : 50), 0);
  const vipRevenue = bookedSeats.filter((s) => s.seatType === "VIP").length * 100;
  const regularRevenue = bookedSeats.filter((s) => s.seatType === "REGULAR").length * 50;

  const pieData = [
    { name: "Booked", value: bookedSeats.length },
    { name: "Available", value: availableSeats.length },
  ];

  const barData = [
    { type: "VIP", revenue: vipRevenue },
    { type: "REGULAR", revenue: regularRevenue },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white py-16 px-6">
      <div className="max-w-6xl mt-12 mx-auto space-y-10">

        {/* Event Info */}
        <Card className="bg-slate-600 p-2 text-gray-900 shadow-xl rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center text-white">
              {event.title} - Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-white space-y-2">
            <p><span className="font-semibold">Venue:</span> {event.venueId.venueName}</p>
            <p><span className="font-semibold">Start:</span> {new Date(event.startTime).toLocaleString()}</p>
            <p><span className="font-semibold">End:</span> {new Date(event.endTime).toLocaleString()}</p>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-green-600 text-white shadow-lg">
            <CardContent className="p-4">
              <p className="text-lg font-semibold">Total Seats</p>
              <p className="text-3xl font-bold">{totalSeats}</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-600 text-white shadow-lg">
            <CardContent className="p-4">
              <p className="text-lg font-semibold">Booked Seats</p>
              <p className="text-3xl font-bold">{bookedSeats.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500 text-white shadow-lg">
            <CardContent className="p-4">
              <p className="text-lg font-semibold">Available Seats</p>
              <p className="text-3xl font-bold">{availableSeats.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-700 text-white shadow-lg">
            <CardContent className="p-4">
              <p className="text-lg font-semibold">Total Revenue</p>
              <p className="text-3xl font-bold">₹{totalRevenue}</p>
            </CardContent>
          </Card>
        </div>

        {/* Pie Chart */}
        <div className="bg-white text-gray-900 p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-bold text-center mb-4 text-indigo-700">Seat Booking Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white text-gray-900 p-6 rounded-xl shadow-xl">
          <h2 className="text-xl font-bold text-center mb-4 text-indigo-700">Revenue by Seat Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#6366f1" name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;
