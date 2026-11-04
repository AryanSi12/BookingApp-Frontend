import React, { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { setUserDetails } from "../Redux/userSlice";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { PageShell, Surface } from "@/Components/ui/PageShell";
import { clearAuthToken } from "@/services/api";
import { addOrganizer, completeLogin, loginUser } from "@/services/auth";

const SignupAsOrganizer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const form = new FormData();
      const userJson = JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      form.append("user", userJson);
      form.append("image", formData.image);

      await addOrganizer(form);

      const loginResponse = await loginUser({
        username: formData.username,
        password: formData.password,
      });

      const { token, userDetails } = await completeLogin(loginResponse.data);
      dispatch(setUserDetails({ userDetails, token }));

      toast.success("Organizer account created!");
      navigate("/");
    } catch (error) {
      clearAuthToken();
      if (error.response) {
        const message =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data?.message;
        toast.error(message || "Signup failed.");
        console.error("Status:", error.response.status);
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error(error.message || "Error during signup.");
      }
    }
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-lg fade-up">
        <Surface className="p-6 md:p-8">
          <p className="section-kicker">Organizer</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-ink">Host with EventSphere</h2>
          <p className="mt-1 text-sm text-slate-500">Create venues, publish shows, and sell seats.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <Label htmlFor="username" className="mb-1.5 text-slate-700">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="mt-1 h-11 rounded-xl"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="mb-1.5 text-slate-700">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-1 h-11 rounded-xl"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="mb-1.5 text-slate-700">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="mt-1 h-11 rounded-xl"
                required
              />
            </div>
            <div>
              <Label htmlFor="image" className="mb-1.5 text-slate-700">Profile image</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="mt-1 h-11 rounded-xl"
              />
              {preview && (
                <Avatar className="mt-4 h-16 w-16">
                  <AvatarImage src={preview} alt="Preview" />
                  <AvatarFallback>O</AvatarFallback>
                </Avatar>
              )}
            </div>
            <button type="submit" className="brand-btn w-full">
              Create organizer account
            </button>
            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-brand hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </Surface>
      </div>
    </PageShell>
  );
};

export default SignupAsOrganizer;
