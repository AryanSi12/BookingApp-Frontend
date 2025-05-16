import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Skeleton } from "@/Components/ui/skeleton";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { useSelector } from "react-redux";
import { CalendarCheck, Building, UserCog } from "lucide-react";

const Organizer = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userDetails } = useSelector((state) => state.user);




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

    setUser(userDetails);
    setLoading(false);
  }, [userDetails, navigate]);

  return (
    <div className="mt-24 px-4 md:px-10 max-w-7xl mx-auto ">
      <Card className=" border border-slate-700 bg-slate-800 p-6 md:p-10 shadow-lg space-y-10">
        {/* Organizer Info */}
        <section className="space-y-6 text-white">
          <div className="flex items-center gap-6 flex-wrap md:flex-nowrap">
            {loading ? (
              <Skeleton className="h-20 w-20 rounded-full" />
            ) : (
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.userImage} alt={user?.username} />
                <AvatarFallback>{user?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div>
              {loading ? (
                <>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-60" />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold">{user?.username}</h2>
                  <p className="text-muted-foreground">{user?.email}</p>
                </>
              )}
            </div>
          </div>

          {/* Roles */}
          <div className=" flex gap-3 flex-wrap">
            {loading ? (
              <>
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </>
            ) : (
              user?.roles?.map((role) => (
                <Badge key={role} variant="outline" className="text-sm text-white">
                  {role}
                </Badge>
              ))
            )}
          </div>

          {/* Authority Description */}
          <div className="mt-6">
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <Card className="mt-5 bg-muted/20 p-3 border border-slate-700">
                <CardHeader className="flex items-center gap-2">
                  <UserCog className="text-muted-foreground" />
                  <CardTitle className="text-xl text-white">
                    Organizer Authorities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-base text-white">
                  <ul className="list-disc pl-6">
                    <li>Create, edit, and manage events.</li>
                    <li>View and control venue listings.</li>
                    <li>Monitor seat bookings and event performance.</li>
                    <li>Coordinate venue availability and prevent overlaps.</li>
                    <li>Manage real-time booking flows and user interactions.</li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* My Events & My Venues */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
          {/* My Events Card */}
          <Card
            onClick={() => navigate("/my-events")}
            className="hover:shadow-lg hover:scale-[1.02] transition cursor-pointer overflow-hidden"
          >
            <img
              src="public\My Events.jpg"
              alt="Events"
              className="h-56 w-full object-cover"
            />
            <CardHeader className="flex items-center gap-2">
              <CalendarCheck className="text-cyan-600" />
              <CardTitle>My Events</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400">
              View, manage, and track your upcoming and past events.
            </CardContent>
          </Card>

          {/* My Venues Card */}
          <Card
            onClick={() => navigate("/my-venues")}
            className="hover:shadow-lg hover:scale-[1.02] transition cursor-pointer overflow-hidden"
          >
            <img
              src="public\My venues.jpg"
              alt="Venues"
              className="h-56 w-full object-cover"
            />
            <CardHeader className="flex items-center gap-2">
              <Building className="text-indigo-600" />
              <CardTitle>My Venues</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400">
              Manage your listed venues and check seat availability.
            </CardContent>
          </Card>
        </section>
      </Card>
    </div>
  );
};

export default Organizer;
