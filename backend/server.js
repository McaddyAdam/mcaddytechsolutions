const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// ── MongoDB Connection ─────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.warn('⚠️  WARNING: MONGODB_URI not set. Form submissions will fail!');
} else {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ Connected to MongoDB Atlas!'))
        .catch((err) => console.error('❌ MongoDB connection error:', err));
}

// Submission Schema & Model
const subSchema = new mongoose.Schema({
    formType:    { type: String, default: 'Contact Form' },
    name:        { type: String, default: 'N/A' },
    email:       { type: String, required: true },
    subject:     { type: String, default: 'N/A' },
    message:     { type: String, required: true },
    submittedAt: { type: Date,   default: Date.now }
});
const Submission = mongoose.model('Submission', subSchema);

// ── API Endpoints (Database Only - Automation moved to EmailJS on frontend) ────

// POST /api/contact 
app.post('/api/contact', async (req, res) => {
    try {
        if (!MONGODB_URI) return res.status(500).json({ error: 'Database not configured.' });
        const { name, email, subject, message, formType } = req.body;
        if (!email || !message) return res.status(400).json({ error: 'Email and message are required.' });

        await new Submission({
            formType: formType || 'Contact Form',
            name: name || 'N/A', email,
            subject: subject || 'N/A', message
        }).save();

        console.log(`[Database] Submission saved from: ${email}`);
        res.status(200).json({ success: true, message: 'Data saved successfully!' });
    } catch (err) {
        console.error('Contact database error:', err.message);
        res.status(500).json({ error: 'Server database error. Please try again.' });
    }
});

// POST /api/quote
app.post('/api/quote', async (req, res) => {
    try {
        if (!MONGODB_URI) return res.status(500).json({ error: 'Database not configured.' });
        const { name, email, subject, message, formType } = req.body;
        if (!email || !message) return res.status(400).json({ error: 'Email and message are required.' });

        await new Submission({
            formType: formType || 'Quote Form',
            name: name || 'N/A', email,
            subject: subject || 'N/A', message
        }).save();

        console.log(`[Database] Quote request saved from: ${email}`);
        res.status(200).json({ success: true, message: 'Data saved successfully!' });
    } catch (err) {
        console.error('Quote database error:', err.message);
        res.status(500).json({ error: 'Server database error. Please try again.' });
    }
});

// POST /api/newsletter
app.post('/api/newsletter', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'A valid email address is required.' });
        }

        // Save subscriber to MongoDB
        if (MONGODB_URI) {
            await new Submission({
                formType: 'Newsletter Subscription',
                name: 'Subscriber',
                email,
                subject: 'Newsletter Subscription',
                message: `Newsletter subscription from: ${email}`
            }).save();
        }

        console.log(`[Database] Newsletter subscriber saved: ${email}`);
        res.status(200).json({ success: true, message: 'Subscribed in database!' });
    } catch (err) {
        console.error('Newsletter database error:', err.message);
        res.status(500).json({ error: 'Database error. Please try again.' });
    }
});

// ── Start Server ───────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Mcaddy Tech Backend (Database Phase) is running!`);
    console.log(`🌐 Accessible at: http://localhost:${PORT}`);
    console.log(`=========================================`);
});
