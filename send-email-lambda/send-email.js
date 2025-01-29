/** @format */

const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  const { name, email, phone, message } = JSON.parse(event.body);

  // Create a nodemailer transporter object
  const transporter = nodemailer.createTransport({
    service: "gmail", // Using Gmail as SMTP service
    auth: {
      user: process.env.SMTP_USER, // Gmail user (from environment variable)
      pass: process.env.SMTP_PASSWORD, // Gmail app password or your email password
    },
  });

  // Define the HTML email body
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
            color: #ffd700; /* Gold color */
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
          <p><strong>Mensagem:</strong><br />${message}</p>
          
          <!-- Footer Section -->
          <div class="footer">
            <p>Obrigado por entrar em contato com Portal Atender. Iremos lhe responder em breve.</p>
            <p>Para mais informações, visite <a href="https://portalatender.com.br" target="_blank">o nosso site</a>.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: email, // Sender's email
    to: "richardsobreiro@gmail.com", // Recipient's email
    subject: "Nova Mensagem - Portal Atender",
    html: emailHtml,
  };

  try {
    // Send email using the nodemailer transporter
    await transporter.sendMail(mailOptions);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully!" }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email" }),
    };
  }
};
