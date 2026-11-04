import React, { useEffect, useState } from "react";
import { deleteVenueById, getAllVenuesByUserId } from "@/services/venues";
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

const MyVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const fetchVenues = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await getAllVenuesByUserId();
      setVenues(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching venues:", err);
      setError(true);
      toast.error("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleDelete = async (venueId) => {
    try {
      await deleteVenueById(venueId);
      setVenues((prev) => prev.filter((venue) => venue.venueId !== venueId));
      toast.success("Venue deleted successfully.");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete venue");
    }
  };

  return (
    <PageShell>
      <PageHeader
        kicker="Organizer"
        title="My venues"
        subtitle="Halls you can reuse when you create an event."
      />
      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Venues could not be loaded" description="Try the venue list again." onRetry={fetchVenues} />
      ) : venues.length === 0 ? (
        <EmptyState title="No venues found" description="Add a hall before you publish a show." />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <Surface key={venue.venueId} className="flex flex-col overflow-hidden">
              {venue.venueImage ? (
                <img src={venue.venueImage} alt="" className="h-44 w-full object-cover" />
              ) : (
                <div className="flex h-44 items-center justify-center bg-muted text-sm text-muted-foreground">{venue.venueName}</div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-ink">{venue.venueName}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{venue.venueLocation}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {venue.seats?.length || (venue.rows || 0) * (venue.col || 0)} seats
                  {venue.createdBy?.username ? ` · ${venue.createdBy.username}` : ""}
                </p>
                <div className="mt-auto flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/venue-by-id/${venue.venueId}`)}
                    size="sm"
                    className="h-11 flex-1"
                  >
                    View details
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" className="h-11 w-11" title="Delete Venue">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete venue: <strong>{venue.venueName}</strong>
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
              </div>
            </Surface>
          ))}
        </div>
      )}
    </PageShell>
  );
};

export default MyVenues;
