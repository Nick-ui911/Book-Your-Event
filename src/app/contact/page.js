"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constants/apiUrl";
import SmallSpinner from "../components/SmallSpinner";
import { useSelector } from "react-redux";

const ContactPage = () => {
  const user = useSelector((store) => store.user);
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  
  // Add validation states
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email change with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    setStatus(null);

    try {
      const response = await axios.post(BASE_URL + "/contactUs", {
        name,
        email,
        message,
      });
      if (response.data.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
        setEmailError("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen text-black flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-70 blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-100 rounded-full opacity-70 blur-xl" />
      
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl p-8 md:p-10 space-y-8 border border-gray-100 relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-full opacity-50" />
        
        <div className="text-center relative">
          <div className="inline-block p-3 mb-4 bg-blue-50 rounded-full text-blue-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            Get in Touch
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            We'd love to hear from you! Fill out the form below and our team will respond as soon as possible.
          </p>
        </div>
        
        <form className="space-y-6 relative" onSubmit={handleSubmit}>
          <div className="transition-all duration-200 hover:translate-y-[-2px]">
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              placeholder="Your Name"
              required
            />
          </div>

          <div className="transition-all duration-200 hover:translate-y-[-2px]">
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full border ${emailError ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200`}
              placeholder="you@example.com"
              required
            />
            {emailError && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {emailError}
              </p>
            )}
          </div>

          <div className="transition-all duration-200 hover:translate-y-[-2px]">
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Message
            </label>
            <textarea
              rows="5"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
              placeholder="Type your message here..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transform hover:translate-y-[-2px] active:translate-y-0 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading || emailError}
          >
            {loading ? (
              <SmallSpinner />
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </>
            )}
          </button>

          {status === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-green-700 transition-opacity duration-300 opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Message sent successfully! Thank you for reaching out.
            </div>
          )}
          
          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700 transition-opacity duration-300 opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Something went wrong. Please try again.
            </div>
          )}
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-500 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Phone</h3>
            <p className="text-xs text-gray-500">+91 9755716505</p>
          </div>
          
          <div className="p-3">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-500 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Email</h3>
            <p className="text-xs text-gray-500">nbaghel392@gmail.com</p>
          </div>
          
          <div className="p-3">
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-500 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">Address</h3>
            <p className="text-xs text-gray-500">Vijay Nagar, Indore</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;