"use client";
import axios from "axios";
import { useRouter } from 'next/navigation'; // Import for navigation
import { useState, useEffect } from "react";
import {
  ChevronRight,
  Mail,
  Lock,
  User,
  ArrowRight,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { BASE_URL } from "@/constants/apiUrl";
import { addUser } from "@/redux/userSlice";
import { useDispatch } from "react-redux";

export default function AuthComponent() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter(); // Initialize router for navigation

  const handleViewToggle = () => {
    setIsLoginView(!isLoginView);
    setShowSuccessMessage(false);
    setErrorMessage("");
  };

  // Standard Login Function
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before request
    setLoading(true); // Show loader

    // Form validation
    if (!email || !password) {
      setErrorMessage("Please enter both email and password");
      setLoading(false); // Hide loader
      return;
    }

    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));

      // Navigate to homepage after successful signup
      router.push("/");
    } catch (error) {
      setError(error?.response?.data || "Login failed. Try again.");
      console.log(error?.response?.data || "Login failed. Try again.")
    } finally {
      setLoading(false); // Hide loader
    }

    // Show success message
    setSuccessMessage("Login Successful! Welcome back!");
    setShowSuccessMessage(true);

    // Reset form after success (simulating successful login)
    setTimeout(() => {
      setShowSuccessMessage(false);
      setEmail("");
      setPassword("");
    }, 2000);
  };

  // Standard Signup Function
  const handleSignup = async(e) => {
    e.preventDefault();
    setLoading(true); // Show loader

    // Form validation
    if (!name || !email || !password) {
      setErrorMessage("Please fill in all fields");
      setLoading(false); // Hide loader
      return;
    }
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {name, email, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));

      // Navigate to homepage after successful signup
      router.push("/");
    } catch (error) {
      setError(error?.response?.data || "signup failed. Try again.");
      console.log(error?.response?.data || "signup failed. Try again.")
    } finally {
      setLoading(false); // Hide loader
    }

    // Show success message
    setSuccessMessage("Sign up Successful! Welcome back!");
    setShowSuccessMessage(true);

    // Reset form after success (simulating successful login)
    setTimeout(() => {
      setShowSuccessMessage(false);
      setEmail("");
      setPassword("");
    }, 2000);

  };

  // Handle form submission based on current view
  const handleSubmit = (e) => {
    if (isLoginView) {
      handleLogin(e);
    } else {
      handleSignup(e);
    }
  };

  // Google Login Function
  const handleGoogleLogin = () => {
    setLoading(true); // Show loader
    // Here you would implement Google login using NextAuth.js or Firebase Auth, etc.
    console.log("Google login initiated");

    // Show success message
    setSuccessMessage("Google Login Successful!");
    setShowSuccessMessage(true);

    setTimeout(() => setShowSuccessMessage(false), 2000);
    setLoading(false); // Hide loader
  };

  // Google Signup Function
  const handleGoogleSignup = () => {
    setLoading(true); // Show loader
    // Here you would implement Google signup
    console.log("Google signup initiated");

    // Show success message
    setSuccessMessage(
      "Google Account Connected! Account created successfully."
    );
    setShowSuccessMessage(true);

    setTimeout(() => setShowSuccessMessage(false), 2000);
    setLoading(false); // Hide loader
  };

  // Handle Google auth based on current view
  const handleGoogleAuth = () => {
    if (isLoginView) {
      handleGoogleLogin();
    } else {
      handleGoogleSignup();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="relative w-full max-w-md p-8 mx-4 bg-white rounded-lg shadow-xl">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-95 rounded-lg transition-all duration-300 z-10">
            <div className="flex flex-col items-center text-center p-6 animate-fade-in">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800">
                {isLoginView ? "Login Successful!" : "Account Created!"}
              </h3>
              <p className="text-gray-600 mt-2">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Title */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isLoginView ? "Welcome Back" : "Create Account"}
          </h2>
          <button
            onClick={handleViewToggle}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center group"
          >
            {isLoginView ? "Sign Up" : "Log In"}
            <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Loader */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-20">
            <div className="animate-spin w-10 h-10 border-4 border-t-4 border-gray-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-red-700 text-sm">{errorMessage}</span>
              <button
                className="ml-auto"
                onClick={() => setErrorMessage("")}
                type="button"
              >
                <X className="w-4 h-4 text-red-400 hover:text-red-600" />
              </button>
            </div>
          )}

          {/* Name Field - Only for Signup */}
          {!isLoginView && (
            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="name"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div className="relative">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* Password Field with Visibility Toggle */}
          <div className="relative">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password - Only for Login */}
          {isLoginView && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center group transition-all duration-200 transform hover:scale-105"
          >
            <span>{isLoginView ? "Log In" : "Create Account"}</span>
            <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>
              {isLoginView ? "Sign in with Google" : "Sign up with Google"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
