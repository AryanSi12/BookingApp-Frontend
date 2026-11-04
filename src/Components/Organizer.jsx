import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/Components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { useSelector } from "react-redux";
import { CalendarPlus, Building, LayoutDashboard } from "lucide-react";
import { getAllEventsByUserId, getSeatStatusByEventId } from "@/services/events";
import { getAllVenuesByUserId } from "@/services/venues";
import { EmptyState, ErrorState, PageHeader, PageShell, Surface } from "@/Components/ui/PageShell";

const Organizer = () => {
  const navigate = useNavigate();
  const { userDetails } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [events, setEvents] = useState([]);
  const [venueCount, setVenueCount] = useState(0);
  const [occupancy, setOccupancy] = useState([]);

  useEffect(() => {
    if (!userDetails) {
      toast.error("Authentication required. Please log in.");
      navigate("/");
      return;
    }

    if (!userDetails.roles?.includes("ORGANIZER")) {
      toast.error("Access denied: Organizer role required");
      navigate("/");
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const [eventRes, venueRes] = await Promise.all([
          getAllEventsByUserId(),
          getAllVenuesByUserId(),
        ]);
        const eventList = Array.isArray(eventRes.data) ? eventRes.data : [];
        const venueList = Array.isArray(venueRes.data) ? venueRes.data : [];
        const sample = eventList.slice(0, 6);
        // TODO(api): no dashboard aggregate endpoint. Occupancy is counted from seat status on the first events only.
        const bars = await Promise.all(
          sample.map(async (event) => {
            try {
              const seatRes = await getSeatStatusByEventId(event.eventId);
              const seats = Array.isArray(seatRes.data) ? seatRes.data : [];
              const booked = seats.filter((seat) => seat.status === "BOOKED").length;
              return {
                name: String(event.title || "Event").slice(0, 16),
                booked,
                open: Math.max(0, seats.length - booked),
              };
            } catch {
              return { name: String(event.title || "Event").slice(0, 16), booked: 0, open: 0 };
            }
          })
        );
        if (!cancelled) {
          setEvents(eventList);
          setVenueCount(venueList.length);
          setOccupancy(bars);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [navigate, userDetails]);

  const bookedTotal = occupancy.reduce((sum, row) => sum + row.booked, 0);

  return (
    <PageShell>
      <PageHeader
        kicker="Organizer"
        title={`Hello${userDetails?.username ? `, ${userDetails.username}` : ""}`}
        subtitle="A snapshot of your shows and halls. Seat counts come from the existing seat-status calls."
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/create-event" className="brand-btn">Create event</Link>
            <Link to="/create-venue" className="ghost-btn">Add venue</Link>
          </div>
        }
      />

      <div className="mb-8 flex items-center gap-4">
        <Avatar className="h-14 w-14">
          <AvatarImage src={userDetails?.userImage} alt={userDetails?.username || "Organizer"} />
          <AvatarFallback>{userDetails?.username?.charAt(0) || "O"}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">{userDetails?.email}</p>
          <p className="text-sm text-muted-foreground">Organizer</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </div>
      ) : error ? (
        <ErrorState
          title="Dashboard unavailable"
          description="Your events and venues could not be loaded."
          onRetry={() => window.location.reload()}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Events", value: events.length, icon: LayoutDashboard },
              { label: "Venues", value: venueCount, icon: Building },
              { label: "Booked seats", value: bookedTotal, icon: CalendarPlus },
            ].map((stat) => (
              <Surface key={stat.label} className="p-5">
                <stat.icon className="h-5 w-5 text-primary" />
                <p className="mt-3 font-display text-3xl font-bold text-ink">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Surface>
            ))}
          </div>

          <Surface className="mt-6 p-5">
            <h2 className="font-display text-xl font-bold text-ink">Seat occupancy</h2>
            <p className="mt-1 text-sm text-muted-foreground">Booked versus open seats for your latest events.</p>
            {occupancy.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  title="No events yet"
                  description="Create an event after you have a venue."
                  action={<Link to="/create-event" className="brand-btn">Create event</Link>}
                />
              </div>
            ) : (
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupancy}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="booked" fill="hsl(var(--primary))" name="Booked" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="open" fill="hsl(var(--accent))" name="Open" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Surface>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Link to="/my-events" className="surface-card p-5 transition hover:-translate-y-0.5">
              <p className="font-display text-lg font-semibold text-ink">My events</p>
              <p className="mt-1 text-sm text-muted-foreground">Review, open analytics, or delete a show.</p>
            </Link>
            <Link to="/my-venues" className="surface-card p-5 transition hover:-translate-y-0.5">
              <p className="font-display text-lg font-semibold text-ink">My venues</p>
              <p className="mt-1 text-sm text-muted-foreground">Halls you can attach to a new event.</p>
            </Link>
          </div>
        </>
      )}
    </PageShell>
  );
};

export default Organizer;
