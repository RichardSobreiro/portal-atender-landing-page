// /pages/api/send-email.ts

import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

// Define the request body type
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { name, email, phone, message }: ContactFormData = req.body;

    // Create a nodemailer transporter object
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can use other services such as Yahoo, Outlook, etc.
      auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password or app password (for Gmail)
      },
    });

    // Email options
    const mailOptions = {
      from: email, // Sender's email
      to: 'richardsobreiro@gmail.com', // Recipient's email
      subject: 'New Message from Contact Form',
      html: `
        <h1>Contact Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br />${message}</p>
      `,
    };

    try {
      // Send email
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
