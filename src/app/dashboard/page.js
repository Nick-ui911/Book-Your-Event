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
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { setMyEvents } from "@/redux/myeventSlice";
import axios from "axios";
import { BASE_URL } from "@/constants/apiUrl";
import Spinner from "../components/spinner";

export default function DashboardPage() {
  const user = useSelector((store) => store.user);
  const myEvents = useSelector((store) => store.myEvents);
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

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      fetchMyEvents();
    }
  }, [user]);
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
    { label: "Tickets Bought", value: 8 }, // 🔧 Make dynamic later
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

  const activity = [
    {
      icon: <PlusCircle className="w-4 h-4 text-purple-500" />,
      desc: "You created 'Tech Talks 2025'",
    },
    {
      icon: <TicketCheck className="w-4 h-4 text-green-500" />,
      desc: "You bought a ticket to 'Open Mic Night'",
    },
    {
      icon: <CalendarDays className="w-4 h-4 text-blue-500" />,
      desc: "Event 'Indie Music Fest' went live",
    },
  ];

  // Auth check
  if (!user) {
    return <Spinner/>;
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
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
        <div className="bg-white rounded-xl shadow-md p-5 col-span-2">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Recent Events
          </h3>
          <ul className="divide-y">
            {recentEvents.map((event, idx) => (
              <li key={idx} className="py-3 flex justify-between items-center">
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
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Recent Activity
          </h3>
          <ul className="space-y-4">
            {activity.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 text-sm text-gray-600"
              >
                <div className="bg-gray-100 p-2 rounded-full">{item.icon}</div>
                <span>{item.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/explore">
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer flex items-center gap-4">
            <Globe className="text-blue-600 w-6 h-6" />
            <div>
              <h4 className="font-semibold text-gray-700">Explore Events</h4>
              <p className="text-sm text-gray-500">
                See what others are hosting.
              </p>
            </div>
          </div>
        </Link>

        <Link href="/create-event">
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

        <Link href="/dashboard/tickets">
          <div className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer flex items-center gap-4">
            <TicketCheck className="text-green-600 w-6 h-6" />
            <div>
              <h4 className="font-semibold text-gray-700">My Tickets</h4>
              <p className="text-sm text-gray-500">
                Check tickets you’ve purchased.
              </p>
            </div>
          </div>
        </Link>
      </section>
    </div>
  );
}
