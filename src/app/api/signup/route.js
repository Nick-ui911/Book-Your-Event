export const dynamic = "force-dynamic"; // ⬅️ ADD THIS!

import dotenv from "dotenv"; // ⬅️ ADD this
dotenv.config(); // ⬅️ AND this
import { NextResponse } from "next/server";
import User from "@/models/user"; // adjust path if needed
import bcrypt from "bcrypt";
import { connectDB } from "@/config/database";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB(); // connect to DB first

    const body = await req.json();

    const { name, email, password, gender } = body;

    // 🔹 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email already exists" }, { status: 400 });
    }

    // 🔹 Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // 🔹 Create new user
    const user = new User({
      name,
      password: hashPassword,
      email,
      gender,
    });

    const savedUser = await user.save();

    // 🔹 Generate JWT Token
    const token = savedUser.getJWT(); // assuming it's a method in user model

    const cookieStore = await cookies(); // ✅ Now this is already async safe
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      path: "/",
    });

    return NextResponse.json({
      message: "User created successfully",
      data: savedUser,
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    return NextResponse.json({ message: "Failed to save user data." }, { status: 500 });
  }
}
