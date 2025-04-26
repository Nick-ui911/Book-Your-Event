"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import axios from "axios";
import { X, Edit, Upload, MapPin, Calendar, Clock } from "lucide-react";

import { BASE_URL } from "@/constants/apiUrl";
import Spinner from "@/app/components/spinner";
import SmallSpinner from "@/app/components/SmallSpinner";

export default function HeavenlyEventEditPage() {
  const { eventId } = useParams();
  const router = useRouter();
  const myEvents = useSelector((s) => s.myEvents);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        if (myEvents.length) {
          const ev = myEvents.find((e) => e._id === eventId);
          if (ev) {
            hydrateFields(ev);
            setLoading(false);
            return;
          }
        }

        const res = await axios.get(`${BASE_URL}/myevents`, {
          withCredentials: true,
        });

        const events = res?.data?.events || [];
        const ev = events.find((e) => e._id === eventId);

        if (!ev) {
          setError("Event not found.");
          setLoading(false);
          return;
        }

        hydrateFields(ev);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [eventId, myEvents]);

  const hydrateFields = (ev) => {
    setTitle(ev.title);
    setDescription(ev.description);
    setDate(ev.date.slice(0, 10));
    setTime(ev.time);
    setLocation(ev.location);
    if (ev.image) setImage(ev.image);
  };

  const handleImageUpload = async (file) => {
    if (!file.type.startsWith("image/"))
      return alert("Please upload an image file");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "devworldimage-cloud");

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dj7i4ts8b/image/upload",
        formData,
        {
          onUploadProgress: (event) => {
            const progress = Math.round((event.loaded * 100) / event.total);
            setUploadProgress(progress);
          },
        }
      );
      setImage(response.data.secure_url);
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const removeImage = () => {
    setImage("");
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = { title, description, date, time, location, image };

    try {
      await axios.patch(`${BASE_URL}/myevents/${eventId}`, payload, {
        withCredentials: true,
      });

      router.push("/myevents");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <Spinner />
    </div>
  );
  
  if (error && !saving) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="bg-white bg-opacity-80 shadow-xl rounded-2xl p-8 border border-red-200">
        <p className="text-red-600 text-center font-medium">{error}</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white bg-opacity-80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-blue-100">
          <div className="flex justify-center mb-6">
          <Edit className="text-blue-400 mr-2" size={32} />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
               Edit Event
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="group">
              <label className="block text-sm font-medium text-indigo-700 mb-1 transition-all group-hover:text-indigo-500">
                Event Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-blue-50 bg-opacity-50 border border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all placeholder-blue-300"
                placeholder="Give your event a magical name"
                required
              />
            </div>

            {/* Description */}
            <div className="group">
              <label className="block text-sm font-medium text-indigo-700 mb-1 transition-all group-hover:text-indigo-500">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-blue-50 bg-opacity-50 border border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all placeholder-blue-300 resize-none"
                placeholder="Describe your heavenly gathering..."
                required
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-medium text-indigo-700 mb-1 flex items-center transition-all group-hover:text-indigo-500">
                  <Calendar size={16} className="mr-1" />
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-blue-50 bg-opacity-50 border border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  required
                />
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-indigo-700 mb-1 flex items-center transition-all group-hover:text-indigo-500">
                  <Clock size={16} className="mr-1" />
                  Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-blue-50 bg-opacity-50 border border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Location */}
            <div className="group">
              <label className="block text-sm font-medium text-indigo-700 mb-1 flex items-center transition-all group-hover:text-indigo-500">
                <MapPin size={16} className="mr-1" />
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-blue-50 bg-opacity-50 border border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all placeholder-blue-300"
                placeholder="Where will this divine gathering take place?"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="group">
              <label className="block text-sm font-medium text-indigo-700 mb-2 transition-all group-hover:text-indigo-500">
                Event Image
              </label>
              
              {!image && (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-xl p-6 bg-blue-50 bg-opacity-50 hover:bg-blue-100 transition-all">
                  <Upload className="text-blue-400 mb-2" size={32} />
                  <p className="text-blue-500 mb-4 text-center">Upload an ethereal image for your event</p>
                  <label className="cursor-pointer px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-full hover:shadow-lg transition-all transform hover:-translate-y-1">
                    Select Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {uploading && (
                <div className="mt-4">
                  <p className="text-sm text-center text-indigo-600 mb-2">
                    {uploadProgress < 100 ? "Ascending to the clouds..." : "Almost there..."}
                  </p>
                  <div className="w-full bg-blue-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {image && (
                <div className="mt-4 flex justify-center">
                  <div className="relative inline-block">
                    <img
                      src={image}
                      alt="Uploaded"
                      className="w-48 h-48 object-cover rounded-2xl shadow-lg border border-blue-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-white border border-red-300 rounded-full p-2 hover:bg-red-500 hover:text-white transition-all shadow-md"
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className={`w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                  saving ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {saving ? (
                  <SmallSpinner />
                ) : (
                  <>Update</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}