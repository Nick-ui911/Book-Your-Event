import { connectDB } from "@/config/database";
import { authUser } from "@/middleware/authUser";
import { NextResponse } from "next/server";
import Event from "@/models/event";

export async function GET(req) {
  try {
    await connectDB() // Always connect to DB first

    const { error, user, response } = await authUser();
    if (error) return response; // If not authenticated

    // Fetch all events except the ones created by the logged-in user
    const events = await Event.find({ createdBy: { $ne: user._id } });

    if (!events || events.length === 0) {
      return NextResponse.json(
        { message: "No events found.", events: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Events fetched successfully.", events },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch events." },
      { status: 500 }
    );
  }
}
