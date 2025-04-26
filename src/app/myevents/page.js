"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BASE_URL } from "@/constants/apiUrl";
import axios from "axios";
import { setMyEvents } from "@/redux/myeventSlice";
import Link from "next/link";
import Spinner from "../components/spinner";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const MyEventsPage = () => {
  const user = useSelector((store) => store.user);
  const myEvents = useSelector((store) => store.myEvents);
  const dispatch = useDispatch();
   const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);
  

  const fetchMyEvents = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}/myevents`, {
        withCredentials: true,
      });
      const events = res.data.events || [];
      dispatch(setMyEvents(events));
    } catch (err) {
      console.error("Failed to fetch my events:", err);
      setError("Something went wrong while loading your events.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
  }, [user]);

   // Auth check
   if (!user) {
    return <Spinner/>;
  }
  return (
    <div className="min-h-screen px-6 py-8 max-w-6xl mx-auto bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        🎟️ My Events
      </h1>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Spinner />
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : myEvents && myEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myEvents.map((event) => (
            <motion.div
              key={event._id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              <Link href={`/myevents/${event._id}`}>
                <div className="h-48 w-full overflow-hidden relative">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-200 to-purple-300">
                      <img
                        src="/dummyEvent.png"
                        alt="Event"
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold text-indigo-700 line-clamp-1">
                    {event.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {event.description}
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>📅 {new Date(event.date).toLocaleDateString()} at {event.time}</p>
                    <p>📍 {event.location}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          You haven’t created any events yet.
        </p>
      )}
    </div>
  );
};

export default MyEventsPage;
