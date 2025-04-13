import { connectDB } from "@/config/database";
import { authUser } from "@/middleware/authUser"; // Optional if you want only logged-in user
import EventCard from "@/models/eventCard";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // Authenticate user (if needed)
    const { error, user, response } = await authUser();
    if (error) return response;

    // Fetch EventCards where paymentStatus is captured
    const eventCards = await EventCard.find({
      userId: user._id,
      paymentStatus: "captured", // Only show successful payments
    }).populate("eventId"); // Optional: if you want event details too

    if (!eventCards || eventCards.length === 0) {
      return NextResponse.json(
        { message: "No event cards found for this user.", eventCards: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Event cards fetched successfully.", eventCards },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching event cards:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch event cards." },
      { status: 500 }
    );
  }
}
