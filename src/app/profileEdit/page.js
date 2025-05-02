"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BASE_URL } from "@/constants/apiUrl";
import { addUser } from "@/redux/userSlice";
import {
  Camera,
  User,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fileProgress, setFileProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch profile and sync with Redux
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/profile`, {
          withCredentials: true,
        });
        dispatch(addUser(res?.data?.data?.user));
      } catch (error) {
        if (error.response?.status === 401) {
          router.push("/login");
        } else {
          console.error("Error fetching profile", error);
        }
      }
    };

    fetchProfile();
  }, [dispatch, router]);

  // Sync form with Redux state
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setMobileNo(user.mobileNo || "");
      setPhotoUrl(user.photoUrl || "");
      setGender(user.gender || "");
    }
  }, [user]);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    await uploadFile(uploadedFile);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer?.files?.[0];
    if (!droppedFile) return;

    await uploadFile(droppedFile);
  };

  const uploadFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "devworldimage-cloud");

    setLoading(true);
    setFileProgress(0);

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dj7i4ts8b/image/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setFileProgress(progress);
          },
        }
      );
      setPhotoUrl(response.data.secure_url);
      setError("");
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.patch(
        `${BASE_URL}/profileEdit`,
        {
          name,
          email,
          mobileNo,
          photoUrl,
          gender,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res.data?.data));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setTimeout(() => router.push("/profile"), 3000);
    } catch (error) {
      setError(error?.response?.data?.message || "Error updating profile");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center mb-6 text-indigo-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Profile</span>
        </button>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
            <h2 className="text-3xl font-bold text-white">Edit Your Profile</h2>
            <p className="text-indigo-200 mt-1">
              Update your personal information
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center"
              >
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-900/30 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center"
              >
                <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>Profile updated successfully! Redirecting...</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Profile photo section */}
              <div className="mb-8 flex flex-col items-center">
                <div className="mb-4 relative">
                  {photoUrl ? (
                    <Image
                      src={photoUrl}
                      alt="Profile"
                      width={128} // 32 * 4 (adjust based on the size you need)
                      height={128} // 32 * 4 (adjust based on the size you need)
                      className="rounded-full object-cover border-4 border-indigo-500 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-indigo-900/50 flex items-center justify-center border-4 border-indigo-500 shadow-lg">
                      <User className="w-16 h-16 text-indigo-300" />
                    </div>
                  )}

                  <div className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 shadow-lg cursor-pointer">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Camera className="w-5 h-5 text-white" />
                      <input
                        type="file"
                        id="photo-upload"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Drag & drop area */}
                <div
                  className={`w-full p-4 border-2 border-dashed rounded-lg text-center mb-6 transition-colors
                    ${
                      isDragging
                        ? "border-indigo-400 bg-indigo-900/30"
                        : "border-gray-600 bg-gray-800/50"
                    }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <p className="text-indigo-300 text-sm">
                    {isDragging
                      ? "Drop to upload"
                      : "Drag & drop an image here or click to browse"}
                  </p>
                </div>

                {/* Upload progress */}
                {loading && (
                  <div className="w-full mb-4">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${fileProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-indigo-300 mt-1 text-center">
                      {fileProgress}% uploaded
                    </p>
                  </div>
                )}
              </div>

              {/* Form fields */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-indigo-300 mb-2 text-sm font-medium">
                    <User className="w-4 h-4 mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="flex items-center text-indigo-300 mb-2 text-sm font-medium">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 cursor-not-allowed"
                    placeholder="Your email"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="flex items-center text-indigo-300 mb-2 text-sm font-medium">
                    <Phone className="w-4 h-4 mr-2" />
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="Your mobile number"
                  />
                </div>

                <div>
                  <label className="flex items-center text-indigo-300 mb-2 text-sm font-medium">
                    Gender
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {["Male", "Female", "Other"].map((option) => (
                      <div
                        key={option}
                        onClick={() => setGender(option)}
                        className={`cursor-pointer p-3 rounded-lg border transition-all ${
                          gender === option
                            ? "border-indigo-500 bg-indigo-900/50 text-white"
                            : "border-gray-700 bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          <span>{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-8 flex space-x-4">
                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="flex-1 py-3 px-4 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium flex items-center justify-center
                    ${
                      loading
                        ? "bg-indigo-800 text-indigo-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500"
                    }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;
