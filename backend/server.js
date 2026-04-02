const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images) from the new frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// The file where we will store the form submissions
const dbFile = path.join(__dirname, 'submissions.json');

// Helper to reliably read existing submissions
function getSubmissions() {
    if (!fs.existsSync(dbFile)) {
        return [];
    }
    const data = fs.readFileSync(dbFile, 'utf8');
    try {
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Helper to save submissions
function saveSubmissions(data) {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf8');
}

// POST endpoint to handle form submissions
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, subject, message, formType } = req.body;
        
        // Basic validation
        if (!email || !message) {
            return res.status(400).json({ error: 'Email and message are required' });
        }

        const newSubmission = {
            id: Date.now().toString(),
            formType: formType || 'Contact Form',
            name: name || 'N/A',
            email,
            subject: subject || 'N/A',
            message,
            submittedAt: new Date().toISOString()
        };

        const submissions = getSubmissions();
        submissions.push(newSubmission);
        saveSubmissions(submissions);

        console.log(`[New Submission] from ${email} (${formType || 'Contact'})`);
        res.status(200).json({ success: true, message: 'Message successfully sent!' });
    } catch (error) {
        console.error('Error saving submission:', error);
        res.status(500).json({ error: 'Server error while saving submission' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Mcaddy Tech Backend is running!`);
    console.log(`🌐 Accessible at: http://localhost:${PORT}`);
    console.log(`📋 Submissions will be saved to: submissions.json`);
    console.log(`=========================================`);
});
