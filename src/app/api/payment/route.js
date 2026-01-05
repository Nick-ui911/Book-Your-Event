import { NextResponse } from "next/server";
import EventCard from "@/models/eventCard";
import User from "@/models/user";
import { connectDB } from "@/config/database";
import Wallet from "@/models/wallet";
import Event from "@/models/event";
import transporter from "@/lib/nodemailerconfig";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { userId, toUserId, eventId, amount, eventName } = body;

    // 1. Create Event Card
    const newCard = await EventCard.create({
      userId,
      eventId,
      paymentAmount: amount,
      paymentStatus: "captured",
    });

    // 2. Add payment to user
    const user = await User.findById(userId);
    user.payments.push({
      toUser: toUserId,
      amount,
      eventName,
    });
    await user.save();

    // 3. Update or create wallet
    let wallet = await Wallet.findOne({ userId: toUserId });

    if (!wallet) {
      wallet = await Wallet.create({
        userId: toUserId,
        balance: amount,
        history: [
          {
            type: "credit",
            amount,
            description: `Received payment for event ${eventName}`,
          },
        ],
      });
    } else {
      wallet.balance += amount;
      wallet.history.push({
        type: "credit",
        amount,
        description: `Received payment for event ${eventId}`,
      });
      await wallet.save();
    }

    // 4. Get Event Details
    const event = await Event.findById(eventId);
    const toUser = await User.findById(toUserId);

    // 5. Send email to event creator
    const mailOptions = {
      from: process.env.EMAIL_ADMIN,
      to: toUser.email,
      subject: `Payment Received for Event: ${event?.title || eventName}`,
      text: `Hello ${toUser.name},

You have received a payment of ₹${amount} for your event "${
        event?.title || eventName
      }".

Event Details:
- Event Title: ${event?.title}
- Event Date: ${event?.date}
- Buyer: ${user.name}
- Amount: ₹${amount}

Check your wallet for updated balance.

Best regards,  
DevTinder Team`,
    };
    // 6. Send email to buyer with ticket details
    const buyerTicketMail = {
      from: process.env.EMAIL_ADMIN,
      to: user.email,
      subject: `Your Ticket for: ${event?.title || eventName}`,
      text: `Dear ${user.name},

Thank you for booking your ticket for the event "${event?.title}".

Here are your event details:

- Event Title: ${event?.title}
- Description: ${event?.description || "N/A"}
- Date: ${event?.date}
- Time: ${event?.time || "N/A"}
- Venue: ${event?.venue || "Online/To be Announced"}
- Ticket Amount Paid: ₹${amount}

Please keep this email as your confirmation. Show this at the entry or keep it for your records.

We hope you enjoy the event!

Best regards,  
DevTinder Team`,
    };

    await transporter.sendMail(buyerTicketMail);

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        success: true,
        message: "Event card created, payment recorded and email sent.",
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
