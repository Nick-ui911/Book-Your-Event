import { NextResponse } from "next/server";
import { connectDB } from "@/config/database";
import { authUser } from "@/middleware/authUser";

export async function PATCH(req) {
  try {
    await connectDB();

    // Use the updated authUser function
    const auth = await authUser();
    
    // If there was an authentication error, return the error response
    if (auth.error) {
      return auth.response;
    }

    // Get the authenticated user
    const user = auth.user;
    
    // Update user with data from request body
    const body = await req.json();
    
    Object.keys(body).forEach((key) => {
      user[key] = body[key];
    });

    // Save changes to the database
    await user.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      data: user
    });
    
  } catch (error) {
    console.error("Profile Edit Error:", error.message);
    
    return NextResponse.json(
      { message: error.message || "Failed to update profile" },
      { status: 400 }
    );
  }
}