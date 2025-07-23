import { NextResponse } from 'next/server';
import { authUser } from "@/middleware/authUser";
import instance from '@/utils/razorpay';
import Payment from '@/models/payment';
import { connectDB } from "@/config/database";


export const POST = authUser(async (req) => {
  try {
    await connectDB(); // Ensure DB is connected

    const {
      userId,
      toUserId,
      eventId,
      amount,
      eventName
    } = await req.json();

    const order = await instance.orders.create({
      amount: amount,
      currency: 'INR',
      receipt: `receipt#1 ${Date.now()}`,
      notes: {
      userId,
      toUserId,
      eventId,
      eventName
      },
    });

    const payment = new Payment({
      userId: userId,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    return NextResponse.json({
      ...savedPayment.toJSON(),
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
});
