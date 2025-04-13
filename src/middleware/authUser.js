import jwt from "jsonwebtoken";
import User from "@/models/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Middleware to authenticate the user from JWT token
 * Returns the user object if authentication is successful
 * Returns a NextResponse with appropriate error if authentication fails
 */
export const authUser = async () => {
  try {
    // Get token from cookies
    // getting cookie automatically because Next gives you a built-in context (like Request, Response, Headers, Cookies etc.)  , You don't need to manually extract req.headers.cookie anymore!
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    // Check if token exists
    if (!token) {
      return {
        error: true,
        response: NextResponse.json(
          { message: "Authentication required" },
          { status: 401 }
        ),
      };
    }

    // Verify token
    let userData;
    try {
      userData = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error("JWT Verification Error:", jwtError.message);

      if (jwtError.name === "TokenExpiredError") {
        return {
          error: true,
          response: NextResponse.json(
            { message: "Session expired. Please login again" },
            { status: 401 }
          ),
        };
      }

      return {
        error: true,
        response: NextResponse.json(
          { message: "Invalid authentication token" },
          { status: 401 }
        ),
      };
    }

    // Fetch user from database
    const user = await User.findOne({ email: userData.email });

    if (!user) {
      return {
        error: true,
        response: NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        ),
      };
    }

    // Authentication successful, return user object
    return {
      error: false,
      user,
    };
  } catch (error) {
    console.error("Authentication Error:", error.message);
    return {
      error: true,
      response: NextResponse.json(
        { message: "Authentication failed" },
        { status: 500 }
      ),
    };
  }
};
