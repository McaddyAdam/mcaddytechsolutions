const sendMail = require('./mail');

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, subject, message } = req.body;
  if (!email || !message) {
    res.status(400).json({ error: 'Email and message are required.' });
    return;
  }

  await sendMail(
    `Quote request from ${name || 'Unknown'}`,
    `Name: ${name || 'N/A'}\nEmail: ${email}\nSubject: ${subject || 'N/A'}\nMessage: ${message}`,
    res
  );
};
