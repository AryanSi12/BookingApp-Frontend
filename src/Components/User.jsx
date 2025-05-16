import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { TicketCheck, UserCircle } from "lucide-react";

const User = () => {
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

    setUser(userDetails);
    setLoading(false);
  }, [userDetails, navigate]);

  return (
    <div className="mt-24 px-4 md:px-10 max-w-7xl mx-auto">
      <Card className="border border-slate-700 bg-slate-800 p-6 md:p-10 shadow-lg space-y-10">
        {/* User Info */}
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
          <div className="flex gap-3 flex-wrap">
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

          {/* User Description */}
          <div className="mt-6">
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : (
              <Card className="mt-5 bg-muted/20 p-3 border border-slate-700">
                <CardHeader className="flex items-center gap-2">
                  <UserCircle className="text-muted-foreground" />
                  <CardTitle className="text-xl text-white">
                    User Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-base text-white">
                  <ul className="list-disc pl-6">
                    <li>Browse available events and venues.</li>
                    <li>Book seats in real-time and track your bookings.</li>
                    <li>Access booking history and status updates.</li>
                    <li>Enjoy personalized event suggestions.</li>
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* My Bookings */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
         {loading ? (
  <Card className="overflow-hidden">
    <Skeleton className="h-56 w-full rounded-none" />
    <CardHeader className="flex items-center gap-2 px-4 pt-4">
      <Skeleton className="h-6 w-6 rounded-full" />
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-3/4 mt-2" />
    </CardContent>
  </Card>
) : (
  <Card
    onClick={() => navigate("/my-bookings")}
    className="hover:shadow-lg hover:scale-[1.02] transition cursor-pointer overflow-hidden"
  >
    <img
      src="public\\Screenshot 2025-05-16 013424.png"
      alt="My Bookings"
      className="h-56 w-full object-cover"
    />
    <CardHeader className="flex items-center gap-2">
      <TicketCheck className="text-green-600" />
      <CardTitle>My Bookings</CardTitle>
    </CardHeader>
    <CardContent className="text-slate-400">
      View all your booked events and seat details in one place.
    </CardContent>
  </Card>
)}

        </section>
      </Card>
    </div>
  );
};

export default User;
