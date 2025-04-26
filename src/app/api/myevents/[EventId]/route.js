import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/config/database";
import Event from "@/models/event";
import { authUser } from "@/middleware/authUser";

export async function PATCH(req, { params }) {
  await connectDB(); // ensure DB is ready
  const { error, user, response } = await authUser(); // throws 401 if invalid
  const { EventId } = params;

  // 1️⃣  find the event that belongs to this user
  const event = await Event.findOne({ _id: EventId, createdBy: user._id });
  if (!event) {
    return NextResponse.json({ message: "Event not found" }, { status: 404 });
  }

  // 2️⃣  extract & whitelist fields
  const body = await req.json();
  const { title, description, image, date, time, location } = body;

  if (title !== undefined) event.title = title;
  if (description !== undefined) event.description = description;
  if (date !== undefined) event.date = date;
  if (time !== undefined) event.time = time;
  if (location !== undefined) event.location = location;
  if (image !== undefined) event.image = image;

  // 3️⃣  save with schema validation
  try {
    await event.save();
    return NextResponse.json({ event });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
