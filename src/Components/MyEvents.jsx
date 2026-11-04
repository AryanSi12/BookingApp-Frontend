import React, { useEffect, useState } from "react";
import { deleteEventById, getAllEventsByUserId } from "@/services/events";
import { Button } from "@/Components/ui/button";
import { Skeleton } from "@/Components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/Components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { EmptyState, ErrorState, PageHeader, PageShell, Surface } from "@/Components/ui/PageShell";
import { formatEventWhen } from "@/lib/utils";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await getAllEventsByUserId();
      setEvents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(true);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      await deleteEventById(eventId);
      setEvents((prev) => prev.filter((event) => event.eventId !== eventId));
      toast.success("Event deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete event");
    }
  };

  return (
    <PageShell>
      <PageHeader
        kicker="Organizer"
        title="My events"
        subtitle="Shows you published. Analytics and delete stay on the same actions as before."
      />
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Events could not be loaded" description="Try the organizer list again." onRetry={fetchEvents} />
      ) : events.length === 0 ? (
        <EmptyState title="No events found" description="Create an event after you pick a venue." />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Surface key={event.eventId} className="flex flex-col overflow-hidden">
              {event.eventImage ? (
                <img src={event.eventImage} alt="" className="h-44 w-full object-cover" />
              ) : (
                <div className="flex h-44 items-center justify-center bg-muted text-sm text-muted-foreground">{event.title}</div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-ink">{event.title}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{event.aboutEvent}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {event.venueId?.venueName || "Venue TBA"}
                  {" · "}
                  {formatEventWhen(event.startTime)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {event.organizerId?.username} {event.organizerId?.email ? `· ${event.organizerId.email}` : ""}
                </p>
                <div className="mt-auto flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/event-analytics/${event.eventId}`)}
                    size="sm"
                    className="h-11 flex-1"
                  >
                    Analytics
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" className="h-11 w-11" title="Delete Event">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the event: <strong>{event.title}</strong>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(event.eventId)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Surface>
          ))}
        </div>
      )}
    </PageShell>
  );
};

export default MyEvents;
