import { adminAuth } from "@/lib/firebase-admin";
import User from "@/models/user";
import { cookies } from "next/headers";
import { connectDB } from "@/config/database";

export async function POST(req) {
  try {
    const { name, email, idToken } = await req.json();

    if (!idToken) {
      return new Response(JSON.stringify({ message: "Missing idToken" }), { status: 400 });
    }

    // ✅ Verify the Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const firebaseEmail = decodedToken.email;

    if (firebaseEmail !== email) {
      return new Response(JSON.stringify({ message: "Email mismatch" }), { status: 400 });
    }

    // ✅ Connect to DB and check if the user already exists
    await connectDB();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new Response(JSON.stringify({ message: "Email already exists" }), { status: 400 });
    }

    // ✅ Create and save the user
    const user = new User({ name, email });
    const savedUser = await user.save();

    // 🎟️ Generate JWT token
    const token = await savedUser.getJWT();

    const cookieStore = await cookies(); // ✅ Now this is already async safe
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === "production" ? true : false,
      path: "/",
    });

    // ✅ Return success
    return new Response(JSON.stringify({
      message: "User created successfully",
      data: savedUser,
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error saving user:", error);
    return new Response(JSON.stringify({ message: "Failed to save user data." }), {
      status: 500,
    });
  }
}
