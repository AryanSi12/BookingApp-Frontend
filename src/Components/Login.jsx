import React, { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserDetails } from "../Redux/userSlice";
import { toast } from "sonner"; // ✅ Sonner toast import

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
        "http://localhost:8092/Public/LoginUser",
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

      toast.success("Login successful!"); // ✅ Success toast
      navigate("/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Login failed."); // ✅ Error toast
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error("Error during login.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent px-4">
      <div className="w-full max-w-lg p-8 bg-gradient-to-tr from-purple-200 via-white to-purple-300 rounded-xl shadow-xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="mt-1 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="********"
              className="mt-1 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" variant="default" className="w-full text-lg py-6">
            Login
          </Button>

          {/* Redirect */}
          <p className="text-center text-sm text-gray-700 dark:text-gray-300">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
