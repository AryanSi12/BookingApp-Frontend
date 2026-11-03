import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { Separator } from "@/Components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";
import axios from "axios";

export default function ProfilePage() {
  const { userDetails } = useSelector((state) => state.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userDetails) {
      setUsername(userDetails.username);
    }
  }, [userDetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password to update profile.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        "https://bookingapp-backend-hsy3.onrender.com/User/updateUserDetails",
        {
          username,
          password,
          currentPassword,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Profile update failed.");
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        toast.error("Current password is incorrect.");
      } else {
        toast.error("An error occurred while updating profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userDetails) return null;

  return (
    <div className="page-shell flex justify-center pb-16 pt-24 md:pt-28">
      <div className="surface-card w-full max-w-2xl p-6 md:p-8 fade-up">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
          <Avatar className="h-24 w-24 shrink-0 ring-4 ring-brand-soft">
            <AvatarImage src={userDetails.userImage} alt={userDetails.username} />
            <AvatarFallback className="bg-brand-soft font-semibold text-brand">
              {userDetails.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <p className="section-kicker">Profile</p>
            <h2 className="mt-1 font-display text-3xl font-bold text-ink break-words">{userDetails.username}</h2>
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {userDetails.roles?.map((role, index) => (
                <Badge
                  key={index}
                  className="rounded-lg bg-brand-soft px-3 py-1 text-xs font-semibold text-brand"
                >
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="space-y-2 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-ink">Email:</span> {userDetails.email}
          </p>
          <p>
            <span className="font-semibold text-ink">Joined:</span>{" "}
            {new Date(userDetails.createdAt).toDateString()}
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <button type="button" className="brand-btn mt-8 w-full sm:w-auto">
              Update profile
            </button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-sm overflow-y-auto p-4 sm:max-w-md sm:p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-xl text-ink">Update profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 pt-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  className="h-11 rounded-xl"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  className="h-11 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  className="h-11 rounded-xl"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <DialogFooter className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="outline" className="w-full sm:w-auto">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="w-full sm:w-auto" disabled={loading}>
                  {loading ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
