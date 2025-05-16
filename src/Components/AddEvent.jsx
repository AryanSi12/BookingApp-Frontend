import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Card, CardContent } from "@/Components/ui/card";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const AddEvent = () => {
  const { userDetails, isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { venueId } = useParams();

  const [eventData, setEventData] = useState({
    title: "",
    aboutEvent: "",
    startTime: "",
    endTime: "",
  });

  const [eventImage, setEventImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please login to add an event.");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setEventImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventImage) {
      toast.error("Please upload an event image.");
      return;
    }

    try {
      setLoading(true);

      const eventPayload = {
        title: eventData.title,
        aboutEvent: eventData.aboutEvent,
        startTime: eventData.startTime,
        endTime: eventData.endTime,
        organizerId: userDetails._id,
      };

      const formData = new FormData();
      formData.append("event", JSON.stringify(eventPayload));
      formData.append("image", eventImage);

      const response = await axios.post(
        `http://localhost:8092/Organizer/createEvent/${venueId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Event created successfully!");
      const eventId = response.data?._id || response.data?.eventId;
      if (!eventId) throw new Error("Event ID not returned.");

      navigate(`/event/${eventId}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-12">
      <Card className="mt-10 w-full max-w-2xl p-6 shadow-lg sm:p-8 rounded-lg">
        <CardContent>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-gray-800 text-center sm:text-left">
            Create a New Event
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-gray-700">
                Event Title
              </Label>
              <Input
                id="title"
                name="title"
                value={eventData.title}
                onChange={handleChange}
                required
                placeholder="e.g. Summer Concert"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="aboutEvent" className="text-gray-700">
                About the Event
              </Label>
              <Textarea
                id="aboutEvent"
                name="aboutEvent"
                value={eventData.aboutEvent}
                onChange={handleChange}
                required
                placeholder="Event details..."
                className="mt-1"
                rows={4}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-4 gap-6">
              <div className="flex-1">
                <Label htmlFor="startTime" className="text-gray-700">
                  Start Time
                </Label>
                <Input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={eventData.startTime}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="endTime" className="text-gray-700">
                  End Time
                </Label>
                <Input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={eventData.endTime}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="eventImage" className="text-gray-700">
                Event Image
              </Label>
              <Input
                type="file"
                id="eventImage"
                name="eventImage"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="mt-1"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              
              className="w-full mt-4 cursor-pointer"
            >
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddEvent;
