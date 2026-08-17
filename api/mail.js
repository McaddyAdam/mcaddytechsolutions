const { MailtrapClient } = require('mailtrap');
require('dotenv').config();

const TOKEN = process.env.MAILTRAP_API_TOKEN;
const SANDBOX_ID = process.env.MAILTRAP_SANDBOX_ID || 0;

const client = new MailtrapClient({ token: TOKEN });
const sender = {
  email: process.env.MAIL_FROM || 'no-reply@mcaddytechsolutions.com',
  name: 'Mcaddy Tech Solutions'
};

module.exports = async function sendMail(subject, text, res) {
  try {
    const response = await client.send({
      from: sender,
      to: [{
        email: process.env.MAILTRAP_TO || 'contact@mcaddytechsolutions.com'
      }],
      subject,
      text,
      category: 'Website Form Submission'
    });
    console.log('Mail sent:', response.id);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Mail delivery error:', error);
    res.status(500).json({ error: 'Unable to send email right now.' });
  }
};
