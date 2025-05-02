import Wallet from "@/models/wallet";
import transporter from "@/lib/nodemailerconfig";
import { authUser } from "@/middleware/authUser";
import { connectDB } from "@/config/database";

export async function POST(req) {
  await connectDB(); 
  const body = await req.json();
  const { error, user } = await authUser();
  const name = user?.name;
  const email = user?.email;
  const { accountNumber, ifsc, holderName, amount } = body;

  if (!amount || amount <= 0)
    return Response.json(
      { success: false, message: "Invalid amount" },
      { status: 400 }
    );

  try {
    const wallet = await Wallet.findOne({ userId: user._id });

    if (!wallet) {
      return Response.json(
        { success: false, message: "Wallet not found" },
        { status: 404 }
      );
    }

    if (wallet.balance < amount) {
      return Response.json(
        { success: false, message: "Insufficient balance" },
        { status: 400 }
      );
    }

    // Update wallet
    wallet.balance -= amount;
    wallet.history.push({
      type: "debit",
      amount,
      description: `Withdrawal to bank account ending in ${accountNumber.slice(
        -4
      )}`,
    });
    await wallet.save();

    // Email to support
    const mailToSupport = {
      from: process.env.EMAIL_ADMIN,
      to: process.env.EMAIL_SUPPORT,
      subject: "Wallet Withdrawal Request",
      text: `Hello Support Team,

A user has submitted a wallet withdrawal request:

- Name: ${name}
- Email: ${email}
- Account Holder Name: ${holderName}
- Account Number: ${accountNumber}
- IFSC Code: ${ifsc}
- Amount: ₹${amount}

Please review and process this request.

Best regards,  
DevTinder Team`,
    };

    // Email to user
    const mailToUser = {
      from: process.env.EMAIL_ADMIN,
      to: email,
      subject: "Withdrawal Request Received",
      text: `Dear ${name},

We have received your wallet withdrawal request for ₹${amount}. Our team will review and process it shortly.

If you need assistance, contact us at ${process.env.EMAIL_SUPPORT}.

Best regards,  
DevTinder Team`,
    };

    await transporter.sendMail(mailToSupport);
    await transporter.sendMail(mailToUser);

    return Response.json({
      success: true,
      message: "Withdrawal request submitted and emails sent.",
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
