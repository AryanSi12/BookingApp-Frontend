import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
        "http://localhost:8092/User/updateUserDetails",
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
    <div className="min-h-screen bg-[#1c1c1c] text-gray-100 px-4 py-8 flex justify-center items-center">
      <Card className="w-full max-w-2xl bg-[#2e2e2e] text-gray-100 shadow-lg rounded-xl">
        <CardContent className="p-6 md:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
            <Avatar className="w-24 h-24 shrink-0">
              <AvatarImage src={userDetails.userImage} alt={userDetails.username} />
              <AvatarFallback>{userDetails.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-teal-400 break-words">{userDetails.username}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                {userDetails.roles?.map((role, index) => (
                  <Badge
                    key={index}
                    className="bg-indigo-700 text-white text-xs px-3 py-1 rounded-full"
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator className="bg-gray-600" />

          <div className="space-y-2 text-sm break-words">
            <p>
              <strong className="text-teal-300">Email:</strong> {userDetails.email}
            </p>
            <p>
              <strong className="text-teal-300">Joined:</strong>{" "}
              {new Date(userDetails.createdAt).toDateString()}
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto">
                Update Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1c1c1c] border border-gray-700 text-gray-100 w-full max-w-sm sm:max-w-md p-4 sm:p-6 overflow-y-auto max-h-[90vh]">

              <DialogHeader>
                <DialogTitle className="text-teal-300 text-xl">Update Profile</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300">Username</Label>
                  <Input
                    id="username"
                    className="bg-[#2e2e2e] border-gray-600 text-gray-100"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className="bg-[#2e2e2e] border-gray-600 text-gray-100"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-gray-300">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    className="bg-[#2e2e2e] border-gray-600 text-gray-100"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <DialogFooter className="pt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
