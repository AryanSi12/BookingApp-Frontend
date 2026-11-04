import React, { useState, useEffect } from "react";
import { Input } from "@/Components/ui/input";
import { createVenue } from "@/services/venues";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Stepper } from "@/Components/ui/PageShell";

const CreateVenue = () => {
   const { isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [venueData, setVenueData] = useState({
    venueName: "",
    venueLocation: "",
    rows: 5,
    col: 5,
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    console.log(isLoggedIn);
    
    if (!isLoggedIn) {
      toast.error("You must be logged in to create a venue.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenueData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload a venue image.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("venue", JSON.stringify(venueData));
      formData.append("image", image);

      const response = await createVenue(formData);
      
      toast.success("Venue created successfully!");
      console.log("Venue created:", response);

      // Extract the venueId properly
      const venueId = response.data?.id || response.data?._id || response.data?.venueId;
      if (!venueId) {
        throw new Error("Venue ID not returned properly from server.");
      }

      setVenueData({ venueName: "", venueLocation: "", rows: 5, col: 5 });
      setImage(null);

      navigate(`/venue-by-id/${venueId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create venue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell pb-16 pt-24 md:pt-28">
      <div className="mx-auto max-w-xl surface-card p-6 md:p-8 fade-up">
        <p className="section-kicker">Organizer</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink">Create a venue</h2>
        <p className="mt-1 text-sm text-muted-foreground">Set rows and columns once, then reuse the hall for events.</p>
        <div className="mt-5">
          <Stepper steps={["Layout", "Save"]} current={0} />
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="venueName" className="mb-1.5">Venue name</Label>
            <Input
              id="venueName"
              name="venueName"
              value={venueData.venueName}
              onChange={handleChange}
              required
              className="h-11 rounded-xl"
              placeholder="e.g. Grand Hall"
            />
          </div>

          <div>
            <Label htmlFor="venueLocation" className="mb-1.5">Venue location</Label>
            <Textarea
              id="venueLocation"
              name="venueLocation"
              value={venueData.venueLocation}
              onChange={handleChange}
              required
              className="rounded-xl"
              placeholder="e.g. 123 Main St, NY"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="rows" className="mb-1.5">Rows</Label>
              <Input
                type="number"
                id="rows"
                name="rows"
                min="1"
                value={venueData.rows}
                onChange={handleChange}
                required
                className="h-11 rounded-xl"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="col" className="mb-1.5">Columns</Label>
              <Input
                type="number"
                id="col"
                name="col"
                min="1"
                value={venueData.col}
                onChange={handleChange}
                required
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image" className="mb-1.5">Venue image</Label>
            <Input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="h-11 rounded-xl"
            />
          </div>

          <VenuePreview rows={venueData.rows} cols={venueData.col} />

          <button type="submit" disabled={loading} className="brand-btn mt-4 w-full">
            {loading ? "Creating..." : "Create venue"}
          </button>
        </form>
      </div>
    </div>
  );
};

function VenuePreview({ rows, cols }) {
  const rowCount = Math.max(0, Number(rows) || 0);
  const colCount = Math.max(0, Number(cols) || 0);
  const previewRows = Math.min(rowCount, 12);
  const previewCols = Math.min(colCount, 16);
  if (!previewRows || !previewCols) return null;

  return (
    <div className="rounded-2xl border border-border bg-muted/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Preview</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {rowCount} × {colCount}. The first row is VIP when the hall is created. This preview is not saved as a custom layout.
      </p>
      <div className="mt-3 space-y-1 overflow-x-auto">
        {Array.from({ length: previewRows }).map((_, row) => (
          <div key={row} className="flex gap-1">
            {Array.from({ length: previewCols }).map((__, col) => (
              <span
                key={`${row}-${col}`}
                className={`h-3.5 w-3.5 shrink-0 rounded-t-md rounded-b-sm ${row === 0 ? "bg-accent" : "bg-primary"}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CreateVenue;
