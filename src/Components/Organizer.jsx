import React, { useEffect, useState } from "react";
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
    <div className="page-shell pb-16 pt-24 md:pt-28">
      <div className="surface-card space-y-10 p-6 md:p-10">
        {/* Organizer Info */}
        <section className="space-y-6 text-ink">
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
                <Badge key={role} variant="outline" className="rounded-lg border-brand/20 bg-brand-soft text-sm text-brand">
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
              <Card className="mt-5 border border-[color:var(--border)] bg-[#faf7f3] p-3">
                <CardHeader className="flex items-center gap-2">
                  <UserCog className="text-brand" />
                  <CardTitle className="font-display text-xl text-ink">
                    Organizer Authorities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-base text-slate-600">
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
        <section className="grid grid-cols-1 gap-6 text-ink md:grid-cols-2">
          {/* My Events Card */}
          <Card
            onClick={() => navigate("/my-events")}
            className="hover:shadow-lg hover:scale-[1.02] transition cursor-pointer overflow-hidden"
          >
            <img
              src="/My Events.jpg"
              alt="Events"
              className="h-56 w-full object-cover"
            />
            <CardHeader className="flex items-center gap-2">
              <CalendarCheck className="text-cyan-600" />
              <CardTitle>My Events</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-500">
              View, manage, and track your upcoming and past events.
            </CardContent>
          </Card>

          {/* My Venues Card */}
          <Card
            onClick={() => navigate("/my-venues")}
            className="hover:shadow-lg hover:scale-[1.02] transition cursor-pointer overflow-hidden"
          >
            <img
              src="/My venues.jpg"
              alt="Venues"
              className="h-56 w-full object-cover"
            />
            <CardHeader className="flex items-center gap-2">
              <Building className="text-indigo-600" />
              <CardTitle>My Venues</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-500">
              Manage your listed venues and check seat availability.
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Organizer;
