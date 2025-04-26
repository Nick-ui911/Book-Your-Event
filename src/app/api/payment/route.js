import { NextResponse } from "next/server";
import EventCard from "@/models/eventCard";
import User from "@/models/user";
import { connectDB } from "@/config/database";
import Wallet from "@/models/wallet";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, toUserId, eventId, amount, eventName } = body;

    // 1. Create Event Card
    const newCard = await EventCard.create({
      userId,
      eventId,
      paymentAmount:amount,
      paymentStatus: "captured", // adjust as needed
    });

    // 2. Add payment to user
    await User.findByIdAndUpdate(userId, {
      $push: {
        payments: {
          toUser: toUserId,
          amount,
        },
      },
    });

    // Find wallet or create if doesn't exist
    let wallet = await Wallet.findOne({ userId: toUserId });

    if (!wallet) {
      // create wallet if doesn't exist
      wallet = await Wallet.create({
        userId: toUserId,
        balance: amount,
        history: [
          {
            type: "credit",
            amount: amount,
            description: `Received payment for event ${eventId}`,
          },
        ],
      });
    } else {
      // update existing wallet
      wallet.balance += amount;
      wallet.history.push({
        type: "credit",
        amount: amount,
        description: `Received payment for event ${eventId}`,
      });
      await wallet.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Event card created and payment recorded",
        card: newCard,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
