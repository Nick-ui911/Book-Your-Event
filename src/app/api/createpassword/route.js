import { NextResponse } from "next/server";
import { authUser } from "@/middleware/authUser";
import User from "@/models/user";
import bcrypt from "bcrypt";
import validator from "validator";

export async function PATCH(req) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { message: "Password is required." },
        { status: 400 }
      );
    }

    const { error, user, response } = await authUser();

    if (error) {
      return response; // if not authenticated
    }

    const existingUser = await User.findById(user._id); // Fetch fresh user

    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    if (existingUser.password) {
      return NextResponse.json(
        {
          message: "Password is already created. Please update it instead.",
        },
        { status: 400 }
      );
    }

   // Validate new password using validator
    if (!validator.isStrongPassword(password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        return NextResponse.json(
          { message: "Password must be strong (8+ chars, uppercase, lowercase, number, symbol)." },
          { status: 400 }
        );
      }

    const hashedPassword = await bcrypt.hash(password, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();

    return NextResponse.json({
      message: "Password created successfully.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Server error." },
      { status: 400 }
    );
  }
}
