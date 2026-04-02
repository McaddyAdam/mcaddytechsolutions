const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images) from the new frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.warn('⚠️ WARNING: MONGODB_URI is not defined in the .env file. The server will run, but form submissions will fail!');
} else {
    mongoose.connect(MONGODB_URI)
        .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
        .catch((err) => console.error('❌ MongoDB connection error:', err));
}

// Define Submission Schema & Model
const subSchema = new mongoose.Schema({
    formType: { type: String, default: 'Contact Form' },
    name: { type: String, default: 'N/A' },
    email: { type: String, required: true },
    subject: { type: String, default: 'N/A' },
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now }
});

const Submission = mongoose.model('Submission', subSchema);

// POST endpoint to handle form submissions
app.post('/api/contact', async (req, res) => {
    try {
        if (!process.env.MONGODB_URI) {
            return res.status(500).json({ error: 'Database is not configured yet. Please try again later.' });
        }

        const { name, email, subject, message, formType } = req.body;
        
        // Basic validation
        if (!email || !message) {
            return res.status(400).json({ error: 'Email and message are required' });
        }

        const newSubmission = new Submission({
            formType: formType || 'Contact Form',
            name: name || 'N/A',
            email,
            subject: subject || 'N/A',
            message
        });

        await newSubmission.save();

        console.log(`[MongoDB Save] New submission from ${email} (${formType || 'Contact'})`);
        res.status(200).json({ success: true, message: 'Message successfully sent!' });
    } catch (error) {
        console.error('Error saving submission to MongoDB:', error);
        res.status(500).json({ error: 'Server error while saving submission' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Mcaddy Tech Backend is running!`);
    console.log(`🌐 Accessible at: http://localhost:${PORT}`);
    console.log(`=========================================`);
});
