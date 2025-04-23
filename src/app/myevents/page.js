"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BASE_URL } from "@/constants/apiUrl";
import axios from "axios";
import { setMyEvents } from "@/redux/myeventSlice";


const MyEventsPage = () => {
  const user = useSelector((store) => store.user);
  const myEvents = useSelector((store) => store.myEvents);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyEvents = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}/myevents`, {
        withCredentials: true,
      });

      const events = res.data.events || [];
      console.log(events)
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

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Events</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : myEvents && myEvents.length > 0 ? (
        myEvents.map((event) => (
          <div key={event._id} className="mb-4 p-4 rounded-lg shadow bg-white">
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p className="text-gray-700">{event.description}</p>
            <p className="text-sm text-gray-500">
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </p>
            <p className="text-sm text-gray-400">{event.location}</p>
          </div>
        ))
      ) : (
        <p>You haven’t created any events yet.</p>
      )}
    </div>
  );
};

export default MyEventsPage;
