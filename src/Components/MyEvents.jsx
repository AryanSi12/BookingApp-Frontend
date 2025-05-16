import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/Components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";
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
import { CalendarDays, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8092/Organizer/getAllEventsByUserId",
          { withCredentials: true }
        );
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(
        `http://localhost:8092/Organizer/deleteEventById/${eventId}`,
        { withCredentials: true }
      );
      setEvents((prev) => prev.filter((e) => e.eventId !== eventId));
      toast.success("Event deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 mt-24">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-52 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-full w-full p-6 mt-24">
      <h2 className="text-3xl font-bold text-center mb-8">My Events</h2>

      {events.length === 0 ? (
        <p className="text-center text-muted-foreground">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card
              key={event.eventId}
              className="overflow-hidden relative shadow-sm border h-[480px] flex flex-col justify-between"
            >
              <img
                src={event.eventImage}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  {event.title}
                  <Badge variant="outline">{event.venueId.venueName}</Badge>
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {event.aboutEvent}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  {format(new Date(event.startTime), "dd MMM yyyy")} -{" "}
                  {format(new Date(event.endTime), "dd MMM yyyy")}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {format(new Date(event.startTime), "hh:mm a")} -{" "}
                  {format(new Date(event.endTime), "hh:mm a")}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={event.organizerId.userImage} />
                    <AvatarFallback>
                      {event.organizerId.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-xs">
                    <p className="font-semibold">
                      {event.organizerId.username}
                    </p>
                    <p className="text-muted-foreground">
                      {event.organizerId.email}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/event-analytics/${event.eventId}`)}
                    size="sm"
                    className="flex-1 cursor-pointer"
                  >
                    View Details
                  </Button>

                  {/* AlertDialog for Delete Confirmation */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="cursor-pointer"
                        title="Delete Event"
                      >
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

export default MyEvents;
