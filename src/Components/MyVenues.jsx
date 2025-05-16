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
import { Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const MyVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8092/Organizer/getAllVenuesByUserId",
          { withCredentials: true }
        );
        setVenues(response.data);
      } catch (err) {
        console.error("Error fetching venues:", err);
        toast.error("Failed to load venues");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const handleDelete = async (venueId) => {
    try {
      await axios.delete(
        `http://localhost:8092/Organizer/deleteVenueById/${venueId}`,
        { withCredentials: true }
      );
      setVenues((prev) => prev.filter((v) => v.venueId !== venueId));
      toast.success("Venue deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete venue");
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
      <h2 className="text-3xl font-bold text-center mb-8">My Venues</h2>

      {venues.length === 0 ? (
        <p className="text-center text-muted-foreground">No venues found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <Card
              key={venue.venueId}
              className="overflow-hidden relative shadow-sm border h-[470px] flex flex-col justify-between"
            >
              <img
                src={venue.venueImage}
                alt={venue.venueName}
                className="w-full h-48 object-cover"
              />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  {venue.venueName}
                  <Badge variant="outline">{venue.seats?.length || 0} Seats</Badge>
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {venue.venueLocation}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {venue.venueLocation}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={venue.createdBy.userImage} />
                    <AvatarFallback>
                      {venue.createdBy.username.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-xs">
                    <p className="font-semibold">{venue.createdBy.username}</p>
                    <p className="text-muted-foreground">{venue.createdBy.email}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/venue-by-id/${venue.venueId}`)}
                    size="sm"
                    className="flex-1 cursor-pointer"
                  >
                    View Details
                  </Button>

                  {/* Delete Dialog */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="cursor-pointer"
                        title="Delete Venue"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete venue:{" "}
                          <strong>{venue.venueName}</strong>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(venue.venueId)}>
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

export default MyVenues;
