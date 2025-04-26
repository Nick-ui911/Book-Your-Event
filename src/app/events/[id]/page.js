"use client";

import { BASE_URL } from "@/constants/apiUrl";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/app/components/spinner";
import { setEvents } from "@/redux/eventsSlice";
import Image from "next/image";
import SmallSpinner from "@/app/components/SmallSpinner";

const EventDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const events = useSelector((store) => store.events);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredEvent, setFilteredEvent] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, processing, success, failed

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/getEvents`, {
        withCredentials: true,
      });
      const data = res.data.events;
      dispatch(setEvents(data));
    } catch (error) {
      console.error("Failed to fetch events:", error);
      if (error.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchEvents();
  }, [user]);

  // Effect to handle API call when payment status changes to success
  useEffect(() => {
    // Only run this effect when payment status changes to "success" and we haven't already completed the payment
    if (paymentStatus === "success") {
      const completePayment = async () => {
        try {
          // Make the API call to your payment endpoint
          await axios.post(
            `${BASE_URL}/payment`,
            {
              userId: user._id,
              toUserId: filteredEvent.createdBy,
              eventId: filteredEvent._id,
              amount: filteredEvent.eventFee,
              eventName: filteredEvent.title,
            },
            {
              withCredentials: true,
            }
          );
        } catch (error) {
          console.error("Payment API call failed:", error);
        }
      };

      completePayment();
    }
  }, [paymentStatus]);

  useEffect(() => {
    if (events && id) {
      const event = events.find((ev) => ev._id === id);
      setFilteredEvent(event);
      // Set page title
      if (event) {
        document.title = `${event.title} | Event Details`;
      }
    }
  }, [events, id]);

  const handlePayment = async () => {
    setPaymentLoading(true);

    // Instead of redirecting, we'll show our modal
    setTimeout(() => {
      setPaymentLoading(false);
      setShowPaymentModal(true);
    }, 800);
  };

  const processPayment = () => {
    setPaymentStatus("processing");

    // Simulate processing time
    setTimeout(() => {
      setPaymentStatus("success");
    }, 2000);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentStatus("pending");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (!filteredEvent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <div className="text-red-500 text-xl font-medium mb-4">
          Event not found
        </div>
        <p className="text-gray-600 mb-6">
          The event you are looking for does not exist or has been removed.
        </p>
        <button
          onClick={() => router.push("/events")}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View All Events
        </button>
      </div>
    );
  }

  const formattedDate = new Date(filteredEvent.date).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm text-gray-600">
          <button
            onClick={() => router.push("/events")}
            className="hover:text-blue-600 transition-colors flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Back to Events
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Event Image */}
          <div className="relative w-full h-80">
            {filteredEvent.image ? (
              <Image
                src={filteredEvent.image}
                alt={filteredEvent.title}
                fill
                priority
                style={{ objectFit: "cover" }}
                className="bg-gray-100"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-800 via-purple-800 to-pink-800">
                <img
                  src="/dummyEvent.png"
                  alt="Event"
                  className="w-32 h-32 object-contain opacity-80"
                />
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="p-8">
            {/* Event Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-0 leading-tight">
                {filteredEvent.title}
              </h1>

              {filteredEvent.eventFee ? (
                <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                  <p className="text-green-700 text-sm font-medium">
                    Registration Fee
                  </p>
                  <p className="text-2xl font-bold text-green-800">
                    ₹{filteredEvent.eventFee.toFixed(2)}
                  </p>
                </div>
              ) : (
                <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                  <p className="text-xl font-bold text-green-800">Free Entry</p>
                </div>
              )}
            </div>

            {/* Event Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="text-gray-800 font-medium">{formattedDate}</p>
                </div>
              </div>

              {filteredEvent.time && (
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-full mr-3">
                    <svg
                      className="w-5 h-5 text-indigo-600"
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
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Time</p>
                    <p className="text-gray-800 font-medium">
                      {filteredEvent.time}
                    </p>
                  </div>
                </div>
              )}

              {filteredEvent.location && (
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <svg
                      className="w-5 h-5 text-purple-600"
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
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Location
                    </p>
                    <p className="text-gray-800 font-medium">
                      {filteredEvent.location}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                About This Event
              </h2>
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {filteredEvent.description}
                </p>
              </div>
            </div>

            {/* Payment Button */}
            <div className="mt-10 flex flex-col items-center">
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full md:w-72 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg font-medium text-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {paymentLoading ? (
                  <>
                    <SmallSpinner />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  <>
                    Secure Your Spot
                    <svg
                      className="ml-2 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </>
                )}
              </button>
              <p className="text-gray-500 text-sm mt-3">
                {filteredEvent.eventFee > 0
                  ? "You'll be prompted to complete payment securely"
                  : "Confirm your attendance for this free event"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slide-up overflow-hidden"
            style={{
              animation: "slideUp 0.3s ease-out forwards",
            }}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Secure Payment</h3>
                {paymentStatus !== "processing" && (
                  <button
                    className="text-white hover:text-gray-200"
                    onClick={closePaymentModal}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <div className="mt-4 flex items-center">
                <div className="bg-white p-2 rounded-full">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-white text-opacity-80">Event</p>
                  <p className="font-medium">{filteredEvent.title}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {paymentStatus === "pending" && (
                <>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-800">
                        ₹{filteredEvent.eventFee.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* Using placeholder images instead of direct file paths */}
                      <div className="h-8 w-12 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div className="h-8 w-12 flex rounded overflow-hidden">
                        <div className="w-1/2 bg-red-500"></div>
                        <div className="w-1/2 bg-yellow-400"></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        defaultValue="4111 1111 1111 1111"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          defaultValue="12/25"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          defaultValue="123"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        defaultValue={user?.name || "John Doe"}
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentStatus === "processing" && (
                <div className="py-10 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Processing Payment
                  </h3>
                  <p className="text-gray-500 text-center">
                    Please wait while we secure your registration...
                  </p>
                </div>
              )}

              {paymentStatus === "success" && (
                <div className="py-10 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Payment Successful!
                  </h3>
                  <p className="text-gray-500 text-center mb-4">
                    Your registration for{" "}
                    <span className="font-medium">{filteredEvent.title}</span>{" "}
                    has been confirmed.
                  </p>
                  <div className="bg-gray-50 w-full p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">Transaction ID</span>
                      <span className="font-medium">
                        TXN{Math.floor(Math.random() * 900000) + 100000}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Date</span>
                      <span className="font-medium">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              {paymentStatus === "pending" && (
                <button
                  onClick={processPayment}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md font-medium flex items-center justify-center"
                >
                  Pay ₹{filteredEvent.eventFee.toFixed(2)} Securely
                  <svg
                    className="ml-2 w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </button>
              )}

              {paymentStatus === "success" && (
                <button
                  onClick={closePaymentModal}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md font-medium"
                >
                  Back to Event
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EventDetailsPage;
