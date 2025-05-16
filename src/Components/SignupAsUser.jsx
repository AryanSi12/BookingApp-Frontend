import React, { useState } from "react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import js from "@eslint/js";
import { setUserDetails } from "../Redux/userSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const SignupAsUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    image: null,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      console.log(formData);

      const form = new FormData();
      //Convert to JSON
      const userJson = JSON.stringify({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      form.append("user", userJson);
      form.append("image", formData.image);

      //send request to server
      const response = await axios.post("http://localhost:8092/Public/AddUser", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      
      const jsonForLogin = JSON.stringify({
        username : formData.username,
        password : formData.password,
      });
      
      
      const res = await axios.post(
        "http://localhost:8092/Public/LoginUser",
        {
          username: formData.username,
          password: formData.password
        },
        { withCredentials: true }
      );

      dispatch(
        setUserDetails({
          userDetails: jsonForLogin,
          token: response.data.token,
          isLoggedIn: true,
        })
      );

      toast.success("Login successful!"); // ✅ Success toast
      navigate("/");
    
      console.log(response);
    }
    catch (error) {
      if (error.response) {
    console.error("Status:", error.response.status);
    console.error("Data:", error.response.data);
    console.error("Headers:", error.response.headers);
  } else if (error.request) {
    console.error("No response received:", error.request);
  } else {
    console.error("Error setting up request:", error.message);
  }
}


  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent px-4">
      <div className="w-full max-w-lg p-8 bg-gradient-to-tr from-purple-200 via-white to-purple-300 rounded-xl shadow-xl space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Sign Up as User
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
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="mt-1 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
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
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="mt-1 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* User Image Upload */}
          <div>
            <Label htmlFor="image" className="text-gray-700 dark:text-gray-300">
              User Image
            </Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 text-gray-900 dark:text-white"
            />
            {preview && (
              <Avatar className="mt-4 w-20 h-20">
                <AvatarImage src={preview} alt="Preview" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" variant="default"
            className="w-full text-lg py-6">
            Sign Up
          </Button>

          {/* Redirect to Login */}
          <p className="text-center text-sm text-gray-700 dark:text-gray-300">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupAsUser;
