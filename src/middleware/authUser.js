import jwt from "jsonwebtoken";
import User from "@/models/user"; // adjust the path if needed
import { cookies } from "next/headers"; // to access cookies on server
import { NextResponse } from "next/server";

export const authUser = async () => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "You must be logged in to access this." }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return user; // ✅ Return the user if authenticated
  } catch (error) {
    console.error("Auth Error:", error.message);
    if (error.name === "TokenExpiredError") {
      return NextResponse.json({ message: "Token has expired. Please log in again." }, { status: 401 });
    }
    return NextResponse.json({ message: "Invalid token." }, { status: 401 });
  }
};
