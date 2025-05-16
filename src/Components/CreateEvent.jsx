import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"; // Button from ShadCN for consistency
import { Skeleton } from "@/components/ui/skeleton"; // Loading state with skeleton

const CreateEvent = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get("http://localhost:8092/User/getAllVenues", {
          withCredentials: true,
        });
        console.log(response);
        
        setVenues(response.data || []);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch venues");
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchVenues();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-6 py-16">
      <div className="max-w-7xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center mt-10 mb-15 text-gray-100 ">
          Select a Venue to Create Event
        </h1>

        {/* Loading state with Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => {
              const venueId = venue.venueId;
              console.log(venueId);
              
              return (
                <Card
                  key={venueId}
                  
                  onClick={() => navigate(`/create-event-final/${venueId}`)}
                  className="bg-white cursor-pointer rounded-2xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition transform"
                >
                  <img
                    src={venue.venueImage}
                    alt={venue.venueName}
                    className="w-full h-48 object-cover rounded-t-2xl"
                  />
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-800 text-center">
                      {venue.venueName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-gray-600">
                    <p>{venue.venueLocation}</p>
                    <p className="text-sm mt-2">
                      {venue.rows} Rows × {venue.col} Columns
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        
      </div>
    </div>
  );
};

export default CreateEvent;
