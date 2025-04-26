import transporter from '@/lib/nodemailerconfig';

export async function POST(req) {
  const body = await req.json();
  const { name, email, message } = body;

  const mailToSupport = {
    from: process.env.EMAIL_ADMIN,
    to: process.env.EMAIL_SUPPORT,
    subject: 'New User Inquiry - Support Request',
    text: `Hello Support Team,

A user has submitted a contact request with the following details:

- Name: ${name}
- Email: ${email}
- Issue: ${message}

Please look into this and respond to the user at your earliest convenience.

Best regards,  
DevTinder Team`,
  };

  const mailToUser = {
    from: process.env.EMAIL_ADMIN,
    to: email,
    subject: 'We Have Received Your Inquiry',
    text: `Dear ${name},

Thank you for reaching out to us. We have received your message and our support team will review your issue as soon as possible. We will get back to you shortly with a response.

If you need immediate assistance, please feel free to contact our support team at ${process.env.EMAIL_SUPPORT}.

Best regards,  
DevTinder Team`,
  };

  try {
    await transporter.sendMail(mailToSupport);
    await transporter.sendMail(mailToUser);
    return Response.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: 'Email could not be sent.' }, { status: 500 });
  }
}
