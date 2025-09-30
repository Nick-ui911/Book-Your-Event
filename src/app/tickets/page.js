"use client";

import { BASE_URL } from "@/constants/apiUrl";
import { setCards } from "@/redux/mycardSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CalendarDays,
  Clock,
  MapPin,
  Check,
  Ticket,
  TrendingUp,
  RefreshCw,
  Download as DownloadIcon,
} from "lucide-react";
import Spinner from "../components/spinner";

const Page = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const router = useRouter();
  const cards = useSelector((store) => store.card);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMyTickets = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}/getCards`, {
        withCredentials: true,
      });

      const events = res?.data?.eventCards || [];
      const mergedTickets = [];

      events.forEach((newTicket) => {
        const existing = mergedTickets.find(
          (ticket) => ticket.eventId._id === newTicket.eventId._id
        );

        if (existing) {
          existing.count = (existing.count || 1) + 1;
        } else {
          mergedTickets.push({ ...newTicket, count: 1 });
        }
      });

      dispatch(setCards(mergedTickets));
    } catch (error) {
      console.error("Failed to fetch my events:", error);
      if (error.response && error.response.status === 401) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, [router]);

  const isEventExpired = (eventDate, eventTime) => {
    if (!eventDate) return false;
    const eventDateObj = new Date(eventDate);
    if (eventTime) {
      const [hoursStr, minutesStr] = eventTime.split(":");
      const hours = Number(hoursStr || 0);
      const minutes = Number(minutesStr || 0);
      if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
        eventDateObj.setHours(hours, minutes, 0, 0);
      }
    }
    const now = new Date();
    return eventDateObj.getTime() < now.getTime();
  };

  const handleDownload = (ticket) => {
    const { eventId, paymentAmount, paymentStatus, count } = ticket || {};
    const { title, description, date, time, location } = eventId || {};
    const formattedDate = date ? new Date(date).toLocaleDateString() : "";
    const formattedTime = time ? time.slice(0, 5) : "";

    const printableHtml = `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Ticket - ${title || "Event"}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; background: #f8fafc; }
      .card { max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid #ddd; border-radius: 16px; }
      .header { background: linear-gradient(90deg, #4f46e5, #7c3aed); color: #fff; padding: 20px; }
      .title { font-size: 20px; font-weight: bold; margin: 0; }
      .section { padding: 20px; }
      .row { display: flex; justify-content: space-between; margin: 8px 0; }
      .label { color: #666; }
      .value { font-weight: 600; }
      .footer { padding: 16px 20px; border-top: 1px solid #eee; display: flex; justify-content: space-between; }
      .badge { background: #eef2ff; color: #4338ca; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="card">
      <div class="header">
        <div class="badge">${count > 1 ? `${count} tickets` : "1 ticket"}</div>
        <h1 class="title">${title || "Event"}</h1>
      </div>
      <div class="section">
        <div class="row"><div class="label">Description</div><div class="value">${
          description || "-"
        }</div></div>
        <div class="row"><div class="label">Date</div><div class="value">${formattedDate}</div></div>
        <div class="row"><div class="label">Time</div><div class="value">${formattedTime}</div></div>
        <div class="row"><div class="label">Location</div><div class="value">${
          location || "-"
        }</div></div>
      </div>
      <div class="footer">
        <div>Status: ${paymentStatus || "-"}</div>
        <div>₹${paymentAmount || 0}</div>
      </div>
    </div>
  </body>
  </html>`;

    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printableHtml);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }
  };

  if (!user || isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center bg-indigo-100 text-indigo-800 rounded-full px-4 py-1 text-sm font-medium mb-3">
            <Ticket className="h-4 w-4 mr-2" />
            My Collection
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            My Event Tickets
          </h1>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xl text-gray-500 max-w-2xl">
              View and manage all your purchased event tickets in one place
            </p>
            <button
              onClick={fetchMyTickets}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition"
            >
              <RefreshCw className="h-5 w-5 text-indigo-600" />
              Reload
            </button>
          </div>
        </div>

        {cards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card, idx) => {
              const { eventId, paymentAmount, paymentStatus, count } = card;
              const { title, description, date, time, location } =
                eventId || {};
              const formattedDate = new Date(date).toLocaleDateString();
              const formattedTime = time?.slice(0, 5);
              const expired = isEventExpired(date, time);

              return (
                <div
                  key={idx}
                  className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:transform hover:-translate-y-1"
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 h-20 w-20 bg-gradient-to-bl from-purple-100 to-transparent rounded-bl-full opacity-70"></div>
                  <div className="absolute bottom-0 left-0 h-16 w-16 bg-gradient-to-tr from-indigo-100 to-transparent rounded-tr-full opacity-70"></div>

                  {/* Ticket badge */}
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md z-10 flex items-center">
                    <Ticket className="h-3 w-3 mr-1" />
                    {count > 1 ? `${count} tickets` : "1 ticket"}
                  </div>

                  {/* Header */}
                  <div
                    className={`bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-5 relative overflow-hidden ${
                      expired ? "opacity-80" : ""
                    }`}
                  >
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, #fff 1px, transparent 1px)",
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                    </div>

                    <h2 className="text-xl font-bold text-white truncate">
                      {title}
                    </h2>
                    <div className="h-1 w-12 bg-indigo-300 mt-2 rounded-full"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-gray-700 mb-4 line-clamp-2 h-12">
                      {description}
                    </p>

                    <div className="space-y-3 mb-5">
                      <div className="flex items-center text-gray-700">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                          <CalendarDays className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="font-medium">{formattedDate}</span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                          <Clock className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="font-medium">{formattedTime}</span>
                      </div>

                      <div className="flex items-center text-gray-700">
                        <div className="bg-indigo-100 p-2 rounded-full mr-3">
                          <MapPin className="h-4 w-4 text-indigo-600" />
                        </div>
                        <span className="font-medium truncate">{location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <div
                          className={`${
                            expired ? "bg-red-100" : "bg-green-100"
                          } p-2 rounded-full mr-2`}
                        >
                          <Check
                            className={`h-4 w-4 ${
                              expired ? "text-red-600" : "text-green-600"
                            }`}
                          />
                        </div>
                        <span
                          className={`${
                            expired ? "text-red-600" : "text-green-600"
                          } font-medium`}
                        >
                          {expired ? "Expired" : paymentStatus}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-lg font-bold text-indigo-700">
                          <span>₹{paymentAmount}</span>
                        </div>
                        <button
                          onClick={() => handleDownload(card)}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition"
                          aria-label="Download ticket"
                        >
                          <DownloadIcon className="h-4 w-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-2xl mx-auto mt-12 border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-6">
              <Ticket className="h-10 w-10 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Tickets Found
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              You haven&apos;t purchased any event tickets yet.
            </p>
            <button className="inline-flex items-center justify-center bg-indigo-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
              <TrendingUp className="h-5 w-5 mr-2" />
              Browse Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
