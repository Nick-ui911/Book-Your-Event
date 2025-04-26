import { NextResponse } from "next/server";
import { authUser } from "@/middleware/authUser";
import Event from "@/models/event";
import { connectDB } from "@/config/database";
export async function POST(req) {
  try {
    await connectDB();
    const { title, description, date, time, image, location, address, eventFee } =
      await req.json();

    // Validate required fields
    if (!title || !date || !time || !location || !address) {
      return NextResponse.json(
        {
          message: "Title, Date, Time, and Location and Address are required.",
        },
        { status: 400 }
      );
    }

    // Authenticate user
    const { error, user, response } = await authUser();
    if (error) return response;

    // Create event
    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      image,
      location,
      address,
      eventFee: eventFee || 0,
      createdBy: user._id,
    });

    return NextResponse.json(
      { message: "Event created successfully.", event: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Server Error." },
      { status: 500 }
    );
  }
}
