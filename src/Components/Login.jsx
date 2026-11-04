import React, { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../Redux/userSlice";
import { toast } from "sonner";
import { PageShell, Surface } from "@/Components/ui/PageShell";
import { clearAuthToken } from "@/services/api";
import { completeLogin, loginUser } from "@/services/auth";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const response = await loginUser(credentials);

      const { token, userDetails } = await completeLogin(response.data);
      dispatch(setUserDetails({ userDetails, token }));

      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      clearAuthToken();
      if (error.response) {
        const message =
          typeof error.response.data === "string"
            ? error.response.data
            : error.response.data?.message;
        toast.error(message || "Login failed.");
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error(error.message || "Error during login.");
      }
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-[0.95fr_1.05fr] md:items-center">
        <Surface className="fade-up hidden overflow-hidden bg-gradient-to-br from-primary-50 via-card to-accent-50 p-8 md:block dark:from-primary-950 dark:via-card dark:to-accent-950">
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
            <button type="submit" className="brand-btn w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
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
