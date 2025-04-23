"use client";

import { BASE_URL } from "@/constants/apiUrl";
import { setEvents } from "@/redux/eventsSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/spinner";

const Page = () => {
  const events = useSelector((store) => store.events);
  const user = useSelector((store) => store.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);


  const fetchEvents = async () => {
    setIsLoading(true);

    try {
      // Only fetch events if user is authenticated
      const res = await axios.get(`${BASE_URL}/getEvents`, {
        withCredentials: true,
      });
      const data = res.data.events;
      dispatch(setEvents(data));
      console.log("Fetched events:", data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      // Handle unauthorized errors by redirecting to login
      if (error.response && error.response.status === 401) {
        router.push("/login");
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [dispatch, router, user]); // Add all dependencies

  if (isLoading) {
    return <Spinner/>;
  }

  // Only process events if they exist
  const todayStr = new Date().toISOString().split("T")[0];
  const filteredEvents =
    events?.filter((e) => {
      if (!e || !e.date) return false;
      const eventDateStr = new Date(e.date).toISOString().split("T")[0];
      return eventDateStr >= todayStr;
    }) || [];

  return (
    <div>
      {filteredEvents.length > 0 ? (
        filteredEvents.map((e) => (
          <div key={e._id} style={{ marginBottom: "1rem" }}>
            <h2>{e.title}</h2>
            <p>{e.description}</p>
            <p>
              {new Date(e.date).toLocaleDateString()} at {e.time}
            </p>
          </div>
        ))
      ) : (
        <p>No upcoming events</p>
      )}
    </div>
  );
};

export default Page;
