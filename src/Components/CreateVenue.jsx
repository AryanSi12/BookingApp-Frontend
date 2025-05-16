import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Card, CardContent } from "@/Components/ui/card";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateVenue = () => {
   const { userDetails, isLoggedIn } = useSelector((state) => state.user);
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
  }, [isLoggedIn]);

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

      const response = await axios.post(
        `http://localhost:8092/Organizer/createVenue`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4">
      <Card className="w-full max-w-xl p-6 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-8">Create a New Venue</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="venueName" className="mb-1">Venue Name</Label>
              <Input
                id="venueName"
                name="venueName"
                value={venueData.venueName}
                onChange={handleChange}
                required
                placeholder="e.g. Grand Hall"
              />
            </div>

            <div>
              <Label htmlFor="venueLocation" className="mb-1">Venue Location</Label>
              <Textarea
                id="venueLocation"
                name="venueLocation"
                value={venueData.venueLocation}
                onChange={handleChange}
                required
                placeholder="e.g. 123 Main St, NY"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="rows" className="mb-1">Rows</Label>
                <Input
                  type="number"
                  id="rows"
                  name="rows"
                  min="1"
                  value={venueData.rows}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="col" className="mb-1">Columns</Label>
                <Input
                  type="number"
                  id="col"
                  name="col"
                  min="1"
                  value={venueData.col}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image" className="mb-1">Venue Image</Label>
              <Input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>

            <Button type="submit"  disabled={loading} className="w-full mt-4">
              {loading ? "Creating..." : "Create a Venue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateVenue;
