"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constants/apiUrl";
import SuccessMessage from "../components/successMessage";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function CreateEventForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [eventPhotoUrl, setEventPhotoUrl] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [eventFee, setEventFee] = useState("");

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState(false);
  const user = useSelector((store) => store.user);
  const router = useRouter();

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!date) newErrors.date = "Date is required";
    if (!time) newErrors.time = "Time is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!address.trim()) newErrors.address = "Address is required";
    return newErrors;
  };

  useEffect(() => {
    if (user === null) return; // wait until user state is hydrated
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        BASE_URL + "/postEvent",
        {
          title,
          description,
          date,
          time,
          eventPhotoUrl,
          location,
          address,
          eventFee: parseFloat(eventFee) || 0,
        },
        {
          withCredentials: true,
        }
      );

      // Show success message for 3 seconds
      setSuccessMessage(true);

      // Reset the form fields
      setTitle("");
      setDescription("");
      setDate("");
      setTime("");
      setEventPhotoUrl("");
      setLocation("");
      setAddress("");
      setEventFee("");
      setErrors({});

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 401) {
        router.push("/login");
        return;
      }
      alert("Something went wrong while posting the event.");
    }
  };

  return (
    <div>
      {/* Improved Success Message */}
      <SuccessMessage
        isVisible={successMessage}
        onClose={() => setSuccessMessage(false)}
      />
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8 space-y-6 mt-10"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Post a New Event
        </h2>

        {/* Title */}
        <div>
          <label className="block font-medium text-gray-700">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>
          <div>
            <label className="block font-medium text-gray-700">Time *</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mt-1"
            />
            {errors.time && (
              <p className="text-red-500 text-sm">{errors.time}</p>
            )}
          </div>
        </div>

        {/* Event Photo */}
        <div>
          <label className="block font-medium text-gray-700">
            Event Photo URL
          </label>
          <input
            type="url"
            value={eventPhotoUrl}
            onChange={(e) => setEventPhotoUrl(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium text-gray-700">Location *</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block font-medium text-gray-700">Address *</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>

        {/* Fee */}
        <div>
          <label className="block font-medium text-gray-700">
            Event Fee (₹)
          </label>
          <input
            type="number"
            min="0"
            value={eventFee}
            onChange={(e) => setEventFee(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 mt-1"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow mt-4"
        >
          Post Event
        </button>
      </form>
    </div>
  );
}
