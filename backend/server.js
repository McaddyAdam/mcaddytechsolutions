const express = require('express');
const cors = require('cors');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || 'smtp.mailtrap.io',
  port: Number(process.env.MAILTRAP_PORT || 2525),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

function createMailOptions(subject, text) {
  return {
    from: process.env.MAIL_FROM || 'no-reply@mcaddytechsolutions.com',
    to: process.env.MAILTRAP_TO || 'contact@mcaddytechsolutions.com',
    subject,
    text
  };
}

async function sendEmail(subject, text, res) {
  try {
    await transporter.sendMail(createMailOptions(subject, text));
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Mail delivery error:', error);
    res.status(500).json({ error: 'Unable to send email right now.' });
  }
}

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required.' });
  }

  await sendEmail(
    `Contact form submission from ${name || 'Unknown'}`,
    `Name: ${name || 'N/A'}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\nMessage: ${message}`,
    res
  );
});

app.post('/api/quote', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!email || !message) {
    return res.status(400).json({ error: 'Email and message are required.' });
  }

  await sendEmail(
    `Quote request from ${name || 'Unknown'}`,
    `Name: ${name || 'N/A'}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\nMessage: ${message}`,
    res
  );
});

app.post('/api/newsletter', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  await sendEmail(
    `Newsletter subscription from ${email}`,
    `A user subscribed to the newsletter with email: ${email}`,
    res
  );
});

app.listen(PORT, () => {
  console.log('=========================================');
  console.log('🚀 Mcaddy Tech Backend is running!');
  console.log(`🌐 Accessible at: http://localhost:${PORT}`);
  console.log('=========================================');
});
