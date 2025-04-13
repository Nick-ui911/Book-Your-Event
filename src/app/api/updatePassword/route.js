import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { authUser } from "@/middleware/authUser";
import validator from "validator";

export async function PATCH(req) {
  try {
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: "Both old and new passwords are required." },
        { status: 400 }
      );
    }

    
    const { error, user, response } = await authUser(); // Destructure it properly ✅
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Old password is incorrect." },
        { status: 400 }
      );
    }

    // Validate new password using validator
    if (!validator.isStrongPassword(newPassword, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        return NextResponse.json(
          { message: "Password must be strong (8+ chars, uppercase, lowercase, number, symbol)." },
          { status: 400 }
        );
      }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { message: `Error: ${error.message}` },
      { status: 400 }
    );
  }
}
