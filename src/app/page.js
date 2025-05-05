"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Map,
  Users,
  Star,
  ArrowRight,
  CalendarX,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BASE_URL } from "@/constants/apiUrl";
import Spinner from "./components/spinner";
import { useDispatch } from "react-redux";
import { setEvents } from "@/redux/eventsSlice";
import HeroSection from "./components/HeroSection";
import CTASection from "./components/Cta-section";

export default function Home() {
  const [email, setEmail] = useState("");
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${BASE_URL}/getEvents`, {
          withCredentials: true,
        });

        // Filter events to only include upcoming ones
        const events = res.data.events || [];
        dispatch(setEvents(events));
        const todayStr = new Date().toISOString().split("T")[0];

        const filtered = events.filter((event) => {
          if (!event || !event.date) return false;
          const eventDateStr = new Date(event.date).toISOString().split("T")[0];
          return eventDateStr >= todayStr;
        });

        // Sort by date (closest first)
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));

   
        setUpcomingEvents(filtered.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch events:", error);
        // Keep the fallback data in case of error
        setUpcomingEvents([
          {
            id: 1,
            title: "Tech Conference 2025",
            date: "August 15-17, 2025",
            location: "San Francisco, CA",
            attendees: 1500,
            image: "/bgImage5.png",
          },
          {
            id: 2,
            title: "Music Festival",
            date: "December 5-7, 2025",
            location: "Austin, TX",
            attendees: 5000,
            image: "/bgImage2.png",
          },
          {
            id: 3,
            title: "Design Summit",
            date: "November 21-23, 2025",
            location: "New York, NY",
            attendees: 800,
            image: "/bgImage4.png",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Event Organizer",
      text: "Evenza has transformed how I manage my events. The platform is intuitive and the features are incredible!",
      rating: 5,
    },
    {
      id: 2,
      name: "Mark Williams",
      role: "Regular Attendee",
      text: "I've discovered so many amazing events through Evenza. Their ticket system is seamless and reliable.",
      rating: 5,
    },
    {
      id: 3,
      name: "Sarthak Gautam",
      role: "Regular Attendee",
      text: "I've discovered so many amazing local events through Evenza and got a new local tradition experience .",
      rating: 4.5,
    },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success(`Thanks for subscribing with: ${email}`);
    setEmail("");
  };

  // Function to format event date nicely
  const formatEventDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Everything You Need for Your Events
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Evenza provides powerful tools for event organizers and attendees,
              making the entire experience seamless from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Post Events */}
            <Link href="/postevent">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Calendar size={28} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Post Events
                </h3>
                <p className="text-gray-600 text-sm">
                  Easily post, publish, and manage your events with our
                  intuitive dashboard and tools.
                </p>
              </div>
            </Link>

            {/* Buy Tickets */}
            <Link href="/events">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Users size={28} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Buy Tickets Online
                </h3>
                <p className="text-gray-600 text-sm">
                  Securely book your spot at events with our smooth ticketing
                  and payment system.
                </p>
              </div>
            </Link>

            {/* Discover Local Events */}
            <Link href="/localevents">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition">
                  <Map size={28} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Discover Local Events
                </h3>
                <p className="text-gray-600 text-sm">
                  Find exciting events near you with our smart search and
                  recommendations.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Upcoming Events
            </h2>
            <Link
              href="/events"
              className="flex items-center text-purple-600 hover:text-purple-700 transition font-medium"
            >
              View all events
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div
                  key={event._id || event.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-48">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                    <Image
                      src={event.image || "/bgImage1.png"}
                      alt={event.title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Calendar size={16} className="mr-2 text-purple-500" />
                      <span>
                        {formatEventDate(event.date)}{" "}
                        {event.time && `at ${event.time}`}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <Map size={16} className="mr-2 text-purple-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Link href={`/events/${event._id || event.id}`}>
                        <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium">
                          Get tickets
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <p className="text-gray-600">
                No upcoming events found. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-gradient-to-br from-purple-50 to-white relative">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="text-purple-100"
          >
            <path
              fill="currentColor"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,117.3C672,107,768,117,864,144C960,171,1056,213,1152,213.3C1248,213,1344,171,1392,149.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-medium text-sm mb-4">
              Success Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by Event Creators{" "}
              <span className="text-purple-600">Worldwide</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful event organizers who have transformed
              their events with Evenza&apos;s powerful platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={22}
                        className={
                          i < testimonial.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                </div>

                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                &quot;{testimonial.text}&quot;
                </p>

                <div className="flex items-center mt-auto">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mr-4 shadow-md text-white font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-purple-600">{testimonial.role}</p>
                  </div>
                </div>

                {testimonial.company && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-500 text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {testimonial.company || "Independent Organizer"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-700 mb-2">98%</div>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-700 mb-2">
                10k+
              </div>
              <p className="text-gray-600">Events Created</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-700 mb-2">
                120+
              </div>
              <p className="text-gray-600">Countries Served</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-700 mb-2">
                4.9/5
              </div>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />

      {/* Newsletter */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-100 rounded-full -ml-24 -mb-24 opacity-40"></div>

        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="md:w-2/3 text-left">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
                  Event Insights
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Stay Ahead with Event Trends
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Join our community of event professionals and get exclusive
                  tips, industry trends, and early access to new features.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    onClick={handleSubscribe}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 font-medium shadow-md transform hover:-translate-y-1"
                  >
                    Subscribe Now
                  </button>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>We respect your privacy. Unsubscribe anytime.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap justify-around text-center text-sm text-gray-500">
              <div className="px-4 py-2">
                <div className="font-semibold text-gray-900 text-lg mb-1">
                  10,000+
                </div>
                <div>Events</div>
              </div>
              <div className="px-4 py-2">
                <div className="font-semibold text-gray-900 text-lg mb-1">
                  Weekly
                </div>
                <div>Newsletter Frequency</div>
              </div>
              <div className="px-4 py-2">
                <div className="font-semibold text-gray-900 text-lg mb-1">
                  4.9/5
                </div>
                <div>Subscriber Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ToastContainer position="bottom-right" />
    </div>
  );
}
