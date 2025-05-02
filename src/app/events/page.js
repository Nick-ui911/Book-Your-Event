"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setEvents } from "@/redux/eventsSlice";
import Spinner from "../components/spinner";
import axios from "axios";
import { BASE_URL } from "@/constants/apiUrl";
import Image from "next/image";

export default function Page() {
  const events = useSelector((store) => store.events);
  const user = useSelector((store) => store.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  const fetchEvents = async () => {
    setIsLoading(true);

    try {
      // Only fetch events if user is authenticated
      const res = await axios.get(`${BASE_URL}/getEvents`, {
        withCredentials: true,
      });
      const data = res.data.events;
      dispatch(setEvents(data));
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
    return <Spinner />;
  }

  // Only process events if they exist
  const todayStr = new Date().toISOString().split("T")[0];
  const filteredEvents =
    events?.filter((e) => {
      if (!e || !e.date) return false;

      // Filter by date - only show upcoming events
      const eventDateStr = new Date(e.date).toISOString().split("T")[0];
      const isUpcoming = eventDateStr >= todayStr;

      // Filter by title if search term exists
      // If no search term is entered → titleMatch is true (accept everything).
      const titleMatch =
        !searchTerm ||
        e.title?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by location if search location exists
      const locationMatch =
        !searchLocation ||
        e.location?.toLowerCase().includes(searchLocation.toLowerCase());

      return isUpcoming && titleMatch && locationMatch;
    }) || [];

      // Auth check
  if (!user) {
    return <Spinner/>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Events</h1>
          <p className="text-gray-600">Discover and book amazing events</p>
        </div>
        
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-indigo-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <label
                htmlFor="title-search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Event Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="title-search"
                  type="text"
                  placeholder="Search by title..."
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-span-1">
              <label
                htmlFor="location-search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <input
                  id="location-search"
                  type="text"
                  placeholder="Search by location..."
                  className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="col-span-1 flex items-end">
              <div className="flex space-x-3 w-full">
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSearchLocation("");
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-200 transition duration-200"
                >
                  Clear
                </button>
                <button
                  onClick={fetchEvents}
                  className="flex-1 bg-gradient-to-r from-blue-300 to-purple-300 text-black px-4 py-2 rounded-lg hover:from-indigo-500 hover:to-blue-500 transition duration-200 shadow-md"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((e) => (
              <div
                key={e._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer border border-gray-100"
                onClick={() => router.push(`/event/${e._id}`)}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Event Image */}
                  <div className="md:w-72 h-48 relative">
                    {e.image ? (
                      <Image
                        src={e.image}
                        alt={e.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="bg-gray-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                      <Image
                        src="/dummyEvent.png"
                        alt="Event"
                        width={80}
                        height={80}
                        className="opacity-70 object-contain"
                      />
                    </div>
                    )}
                  </div>
                  
                  {/* Event Details */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          {e.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {e.description}
                        </p>
                      </div>
                      <div className="hidden md:block">
                        <button
                          onClick={(evt) => {
                            evt.stopPropagation();
                            router.push(`/events/${e._id}`);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-blue-300 to-purple-300 text-black rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-colors shadow-md"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                    
                    {/* Event Metadata */}
                    <div className="flex flex-wrap gap-4 mt-2">
                      <p className="text-gray-700 flex items-center bg-blue-50 px-3 py-1 rounded-full text-sm">
                        <svg
                          className="w-4 h-4 mr-1 text-blue-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                        {new Date(e.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      {e.time && (
                        <p className="text-gray-700 flex items-center bg-indigo-50 px-3 py-1 rounded-full text-sm">
                          <svg
                            className="w-4 h-4 mr-1 text-indigo-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          {e.time}
                        </p>
                      )}
                      {e.location && (
                        <p className="text-gray-700 flex items-center bg-purple-50 px-3 py-1 rounded-full text-sm">
                          <svg
                            className="w-4 h-4 mr-1 text-purple-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                          </svg>
                          {e.location}
                        </p>
                      )}
                    </div>
                    
                    {/* Mobile Book Button */}
                    <div className="mt-4 md:hidden">
                      <button
                        onClick={(evt) => {
                          evt.stopPropagation();
                          router.push(`/events/${e._id}`);
                        }}
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-8 text-center shadow-md border border-gray-100">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No upcoming events found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any events matching your search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSearchLocation("");
                  fetchEvents();
                }}
                className="px-6 py-2 bg-gradient-to-r from-blue-300 to-purple-300 text-black rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-colors shadow-md"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}