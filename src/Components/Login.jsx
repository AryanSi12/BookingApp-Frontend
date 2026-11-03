import React, { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserDetails } from "../Redux/userSlice";
import { toast } from "sonner";
import { PageShell, Surface } from "@/Components/ui/PageShell";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://bookingapp-backend-hsy3.onrender.com/Public/LoginUser",
        credentials,
        { withCredentials: true }
      );

      dispatch(
        setUserDetails({
          userDetails: credentials,
          token: response.data.token,
          isLoggedIn: true,
        })
      );

      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Login failed.");
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error("Error during login.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[0.95fr_1.05fr] md:items-center">
        <Surface className="fade-up hidden overflow-hidden bg-gradient-to-br from-[#fff7f8] via-white to-[#f3efe9] p-8 md:block">
          <p className="section-kicker">Welcome back</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold text-ink">
            Your next seat is one login away.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Sign in to browse events, pick seats, and keep every ticket in one place.
          </p>
        </Surface>

        <Surface className="fade-up-delay p-6 md:p-8">
          <h2 className="font-display text-3xl font-bold text-ink">Sign in</h2>
          <p className="mt-1 text-sm text-slate-500">Use your EventSphere account to continue.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <Label htmlFor="username" className="mb-1.5 text-slate-700">Username</Label>
              <Input
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter your username"
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
                value={credentials.password}
                onChange={handleChange}
                placeholder="********"
                className="mt-1 h-11 rounded-xl"
                required
              />
            </div>
            <button type="submit" className="brand-btn w-full">
              Sign in
            </button>
            <p className="text-center text-sm text-slate-600">
              New here?{" "}
              <Link to="/signup-user" className="font-semibold text-brand hover:underline">
                Create an account
              </Link>
              {" · "}
              <Link to="/signup-organizer" className="font-semibold text-brand hover:underline">
                Host events
              </Link>
            </p>
          </form>
        </Surface>
      </div>
    </PageShell>
  );
};

export default Login;
