import { adminAuth } from "@/lib/firebase-admin";
import User from "@/models/user"; // your Mongoose user model
import { cookies } from "next/headers"; // App Router-specific
import { connectDB } from "@/config/database";

export async function POST(req) {
  try {
    const { idToken } = await req.json();

    // ✅ Verify ID Token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const email = decodedToken.email;

    if (!email) {
      return new Response("Invalid token", { status: 400 });
    }

    // 🧠 Connect to DB and check user
    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // 🎟️ Generate your app's JWT
    const token = await user.getJWT(); // assuming this is a method on your model


    const cookieStore = await cookies(); // ✅ Now this is already async safe
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === "production" ? true : false,
      path: "/",
    });

    // ✅ Success
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Login error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
