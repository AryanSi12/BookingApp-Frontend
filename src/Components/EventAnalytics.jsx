import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { getEventById, getSeatStatusByEventId } from "@/services/events";
import { fetchAllBookingsByEventId } from "@/services/bookings";
import { ErrorState, PageShell } from "@/Components/ui/PageShell";
import { toast } from "sonner";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, XAxis, YAxis, CartesianGrid, Bar, ResponsiveContainer } from "recharts";

const COLORS = ["#4ade80", "#f87171"]; // Green, Red

const EventAnalytics = () => {
  const { eventId } = useParams();

  const [event, setEvent] = useState(null);
  const [seatStatusList, setSeatStatusList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [attendeesNote, setAttendeesNote] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const eventRes = await getEventById(eventId);
        setEvent(eventRes.data);

        const seatRes = await getSeatStatusByEventId(eventId);
        setSeatStatusList(Array.isArray(seatRes.data) ? seatRes.data : []);

        try {
          const bookingRes = await fetchAllBookingsByEventId(eventId);
          setAttendees(Array.isArray(bookingRes.data) ? bookingRes.data : []);
        } catch (bookingError) {
          console.error(bookingError);
          setAttendeesNote("Attendee list is unavailable for this event.");
        }
      } catch (err) {
        setLoadError(true);
        toast.error("Failed to load event analytics.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [eventId]);

  if (loading) {
    return <div className="mt-24 text-center text-muted-foreground">Loading analytics...</div>;
  }

  if (loadError || !event) {
    return (
      <PageShell>
        <ErrorState title="Analytics unavailable" description="This event could not be loaded." />
      </PageShell>
    );
  }

  if (seatStatusList.length === 0) {
    return <div className="mt-24 text-center text-muted-foreground">No analytics data found.</div>;
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
    <div className="page-shell pb-16 pt-24 md:pt-28">
      <div className="mx-auto max-w-6xl space-y-8">

        {/* Event Info */}
        <Card className="surface-card border-[color:var(--border)] p-2">
          <CardHeader>
            <CardTitle className="text-center font-display text-2xl font-bold text-ink">
              {event.title} — Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-center text-slate-600">
            <p><span className="font-semibold text-ink">Venue:</span> {event.venueId.venueName}</p>
            <p><span className="font-semibold text-ink">Start:</span> {new Date(event.startTime).toLocaleString()}</p>
            <p><span className="font-semibold text-ink">End:</span> {new Date(event.endTime).toLocaleString()}</p>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 bg-emerald-600 text-white shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Total Seats</p>
              <p className="mt-1 font-display text-3xl font-bold">{totalSeats}</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-sky-600 text-white shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Booked Seats</p>
              <p className="mt-1 font-display text-3xl font-bold">{bookedSeats.length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-amber-500 text-white shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Available Seats</p>
              <p className="mt-1 font-display text-3xl font-bold">{availableSeats.length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 bg-brand text-white shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Total Revenue</p>
              <p className="mt-1 font-display text-3xl font-bold">₹{totalRevenue}</p>
            </CardContent>
          </Card>
        </div>

        {/* Pie Chart */}
        <div className="surface-card p-6">
          <h2 className="mb-4 text-center font-display text-xl font-bold text-ink">Seat Booking Distribution</h2>
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
        <div className="surface-card p-6">
          <h2 className="mb-4 text-center font-display text-xl font-bold text-ink">Revenue by Seat Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue (₹)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

        <Attendees bookings={attendees} note={attendeesNote} />
      </div>
    </div>
  );
};

function attendeeName(booking) {
  return booking.userId?.username || booking.username || booking.user?.username || "Guest";
}

function attendeeEmail(booking) {
  return booking.userId?.email || booking.email || booking.user?.email || "";
}

function attendeeSeats(booking) {
  const seats = booking.bookedSeats || booking.seats || [];
  return Array.isArray(seats) ? seats.join(" ") : String(seats);
}

function downloadAttendeeCsv(bookings) {
  const header = ["bookingId", "name", "email", "seats", "amountPaid"];
  const lines = [header.join(",")];
  bookings.forEach((booking) => {
    const cells = [
      booking.bookingId || booking._id || "",
      attendeeName(booking),
      attendeeEmail(booking),
      attendeeSeats(booking),
      booking.amountPaid ?? "",
    ].map((value) => `"${String(value).replace(/"/g, '""')}"`);
    lines.push(cells.join(","));
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "attendees.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function Attendees({ bookings, note }) {
  return (
    <div className="surface-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold text-ink">Attendees</h2>
        <button
          type="button"
          className="ghost-btn h-11"
          disabled={!bookings.length}
          onClick={() => downloadAttendeeCsv(bookings)}
        >
          Download CSV
        </button>
      </div>
      {note && <p className="mt-2 text-sm text-muted-foreground">{note}</p>}
      {bookings.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No bookings loaded for this event.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-2 pr-3 font-semibold">Name</th>
                <th className="py-2 pr-3 font-semibold">Email</th>
                <th className="py-2 pr-3 font-semibold">Seats</th>
                <th className="py-2 font-semibold">Paid</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.bookingId || booking._id || attendeeEmail(booking)} className="border-t border-border">
                  <td className="py-3 pr-3 text-foreground">{attendeeName(booking)}</td>
                  <td className="py-3 pr-3 text-muted-foreground">{attendeeEmail(booking)}</td>
                  <td className="py-3 pr-3 text-foreground">{attendeeSeats(booking)}</td>
                  <td className="py-3 text-foreground">{booking.amountPaid != null ? `₹${booking.amountPaid}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EventAnalytics;
