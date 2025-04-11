export const dynamic = "force-dynamic"; // ⬅️ ADD THIS!

import dotenv from "dotenv"; // ⬅️ ADD this
dotenv.config(); // ⬅️ AND this
import { connectDB } from "@/config/database";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  await connectDB(); // Connect to the database

  try {
    const { email, password } = await req.json();

    // Check if email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Compare passwords
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT Token
    const token = user.getJWT();

    const cookieStore = await cookies(); // ✅ Now this is already async safe
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      path: "/",
    });

    // Return user data
    return NextResponse.json({
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
