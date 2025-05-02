"use client";

import Link from "next/link";
import {
  CalendarDays,
  TicketCheck,
  PlusCircle,
  BarChart2,
  Users,
  Globe,
  MailOpen,
  Clock,
  Wallet,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { setMyEvents } from "@/redux/myeventSlice";
import axios from "axios";
import { BASE_URL } from "@/constants/apiUrl";
import Spinner from "../components/spinner";
import { setCards } from "@/redux/mycardSlice";

export default function DashboardPage() {
  const user = useSelector((store) => store.user);
  const myEvents = useSelector((store) => store.myEvents);
  const ticket = useSelector((store) => store.card); // Make sure this matches your slice
  const router = useRouter();
  const dispatch = useDispatch();

  const fetchMyEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/myevents`, {
        withCredentials: true,
      });

      const events = res.data.events || [];
      dispatch(setMyEvents(events));
    } catch (error) {
      console.error("Failed to fetch my events:", error);
      setError("Something went wrong while loading your events.");
    }
  };
  const fetchMyTickets = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/getCards`, {
        withCredentials: true,
      });
      const events = res?.data?.eventCards || [];
      dispatch(setCards(events));
      // console.log(events);
    } catch (error) {
      console.error("Failed to fetch my events:", err);
      // Handle unauthorized errors by redirecting to login
      if (error.response && error.response.status === 401) {
        router.push("/login");
        return;
      }
    }
  };

  useEffect(() => {
    fetchMyEvents();
    fetchMyTickets();
  }, []);
  // 🔢 Filter Events
  const totalMyEvents = myEvents?.length || 0;
  const today = new Date();

  const activeMyEvents =
    myEvents?.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    }) || [];

  const cards = [
    {
      title: "Your Events",
      icon: <CalendarDays className="text-blue-500 w-6 h-6" />,
      description: "Manage and view your posted events.",
      href: "/myevents",
    },
    {
      title: "Your Tickets",
      icon: <TicketCheck className="text-green-500 w-6 h-6" />,
      description: "See your purchased tickets and history.",
      href: "/tickets",
    },
    {
      title: "Create Event",
      icon: <PlusCircle className="text-purple-500 w-6 h-6" />,
      description: "Host an event and sell tickets easily.",
      href: "/postevent",
    },
  ];

  const stats = [
    { label: "Total Events", value: totalMyEvents },
    { label: "Tickets Bought", value: ticket.length }, // 🔧 Make dynamic later
    { label: "Active Events", value: activeMyEvents.length },
    { label: "Upcoming Tickets", value: 2 }, // 🔧 Make dynamic later
  ];

  const recentEvents =
    myEvents
      ?.slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map((event) => ({
        name: event.title,
        date: new Date(event.date).toLocaleDateString(),
        status:
          new Date(event.date) > today
            ? "Upcoming"
            : new Date(event.date).toDateString() === today.toDateString()
            ? "Live"
            : "Completed",
      })) || [];

  // Auth check
  if (!user) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Manage your events, tickets, and more.
        </p>
      </header>

      {/* Quick Navigation Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {cards.map((card, idx) => (
          <Link key={idx} href={card.href}>
            <div className="bg-white shadow-md hover:shadow-lg transition-all rounded-2xl p-5 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-3 rounded-full">{card.icon}</div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-700">
                    {card.title}
                  </h2>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Analytics Summary */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Your Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Events + Activity */}
      <section className="flex flex-col lg:flex-row gap-6">
        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-md p-5 w-full lg:w-1/2">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Recent Events
          </h3>
          {recentEvents.length === 0 ? (
            <p className="text-gray-500">No recent events available.</p>
          ) : (
            <ul className="divide-y">
              {recentEvents.map((event, idx) => (
                <li
                  key={idx}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{event.name}</p>
                    <p className="text-sm text-gray-500">{event.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.status === "Live"
                        ? "bg-green-100 text-green-700"
                        : event.status === "Upcoming"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {event.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-md p-5 w-full lg:w-1/2">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Recent Payments
          </h3>
          {user?.payments?.length > 0 ? (
            <ul className="divide-y">
              {user.payments.slice(0, 3).map((payment, idx) => (
                <li
                  key={idx}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {payment.eventName || "Unknown Event"}
                    </p>
                    <p className="text-sm text-gray-500">
                      ₹{payment.amount} •{" "}
                      {new Date(payment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                    Paid
                  </span>
                </li>
              ))}
            </ul>
          ) : (
           <p className="text-gray-500">You haven&apos;t made any payments yet.</p>

          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/explore">
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer flex items-center gap-4">
            <Globe className="text-purple-600 w-6 h-6" />
            <div>
              <h4 className="font-semibold text-gray-700">Explore Events</h4>
              <p className="text-sm text-gray-500">
                See what others are hosting.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/postevent">
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer flex items-center gap-4">
            <PlusCircle className="text-purple-600 w-6 h-6" />
            <div>
              <h4 className="font-semibold text-gray-700">Create Event</h4>
              <p className="text-sm text-gray-500">
                Host and sell your own event.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/wallet">
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer flex items-center gap-4">
            <Wallet className="text-purple-600 w-5 h-5" />
            <div>
              <h4 className="font-semibold text-gray-700">My Tickets</h4>
              <p className="text-sm text-gray-500">Check your Wallet</p>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
