import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

import { Email } from '@/emails/inquiry-reply-email';

export async function POST(req: Request) {
  const { email, first_name, last_name, body, } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const emailHtml = await render(
    Email({
      first_name: first_name,
      last_name: last_name,
      body: body,
    }),
  );

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'ABIC : Inquirie Reply',
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);

    return NextResponse.json({
        status: "success",
        message: "Email sent successfully",
      });
      
}