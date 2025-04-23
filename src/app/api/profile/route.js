import { NextResponse } from "next/server";
import { connectDB } from "@/config/database";
import { authUser } from "@/middleware/authUser";

export async function GET(req) {
  await connectDB();

  try {
    const user = await authUser(req);
    if (!user) {
      return NextResponse.json({
        message: "User Not Found",
        data: user,
      });
    }

    return NextResponse.json({
      message: "successfully get user details",
      data: user,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      {
        message: "internal server error",
      },
      { status: 400 }
    );
  }
}
