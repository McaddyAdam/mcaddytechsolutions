const sendMail = require('./mail');

module.exports = async function (req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email } = req.body;
  if (!email || !email.includes('@')) {
    res.status(400).json({ error: 'A valid email address is required.' });
    return;
  }

  await sendMail(
    `Newsletter subscription from ${email}`,
    `A user subscribed to the newsletter with email: ${email}`,
    res
  );
};
