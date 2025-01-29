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
        user: process.env.SMTP_USER, // Your email address
        pass: process.env.SMTP_PASSWORD, // Your email password or app password (for Gmail)
      },
    });

    console.log(`process.env.EMAIL: ${process.env.SMTP_USER}`);
    console.log(`process.env.EMAIL_PASSWORD: ${process.env.SMTP_PASSWORD}`);

    // Define the HTML email body with styling and a text-based logo
    const emailHtml = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              color: #333;
              padding: 20px;
            }
            .email-container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 20px;
              box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
              max-width: 600px;
              margin: 0 auto;
            }
            h1 {
              color: #ffd700; /* Gold color for the header */
              text-align: center;
            }
            p {
              font-size: 1.1rem;
              line-height: 1.6;
              margin-bottom: 10px;
            }
            .footer {
              font-size: 0.8rem;
              text-align: center;
              margin-top: 20px;
              color: #999;
            }
            .footer a {
              color: #ffd700;
              text-decoration: none;
            }
            .logo {
              text-align: center;
              font-size: 2.5rem;
              font-weight: bold;
              color: #ffd700;
            }
            .contact-info {
              background-color: #f8f8f8;
              padding: 10px;
              border-radius: 5px;
              margin-top: 20px;
            }
            .contact-info p {
              font-size: 1rem;
              margin: 5px 0;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <!-- Logo Section -->
            <div class="logo">
              Portal Atender
            </div>
            
            <!-- Message Content -->
            <h1>Formulário de Contato</h1>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${phone}</p>
            <p><strong>Menssagem:</strong><br />${message}</p>
            
            <!-- Footer Section -->
            <div class="footer">
              <p>Obrigado por entrar em contato com Portal Atender. Iremos lhe responder em breve.</p>
              <p>Para mais informações, visite <a href="https://portalatender.com.br" target="_blank">o nosso site</a>.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Email options
    const mailOptions = {
      from: email, // Sender's email
      to: 'richardsobreiro@gmail.com', // Recipient's email
      subject: 'Nova Mensagem - Portal Atender',
      html: emailHtml, // Using the HTML template
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
