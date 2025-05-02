import { connectDB } from "@/config/database";
import { authUser } from "@/middleware/authUser";
import Wallet from "@/models/wallet";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Connect to the database
    await connectDB();

    // Authenticate user
    const { error, user, response } = await authUser();
    if (error) return response;

    // Fetch wallet data for the authenticated user
    const walletData = await Wallet.find({ userId: user._id });

    if (!walletData || walletData.length === 0) {
      return NextResponse.json(
        { message: "No wallet data found for this user." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Wallet details fetched successfully.",
        data: walletData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching wallet details.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
