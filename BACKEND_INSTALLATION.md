# Running the Mcaddy Tech Backend API

This guide will show you exactly how to install dependencies and run your backend API server locally!

## 1. Prerequisites
You must have [Node.js](https://nodejs.org/) installed on your computer. You can check if it's already installed by opening a terminal and running:
```bash
node -v
```

## 2. Navigating to the Backend
Because keeping your systems partitioned is best practice, your backend code is isolated in the `backend/` folder. In your terminal, navigate to that directory:
```bash
cd backend
```

## 3. Installing Dependencies
If this is your first time setting everything up on this computer, or you just updated dependencies, simply run:
```bash
npm install
```
This prepares the `express` and `cors` libraries.

## 4. Starting the Server
Start the Express API server that drives your Contact Forms and Web App:
```bash
node server.js
```
Alternatively, you can just type:
```bash
npm start
```

## 5. Success
You should see the terminal successfully respond with:
```bash
=========================================
🚀 Mcaddy Tech Backend is running!
🌐 Accessible at: http://localhost:3000
📋 Submissions will be saved to: submissions.json
=========================================
```

You can now leave the terminal open in the background! Any contact forms submitted on `http://localhost:3000` will be pushed through to your API and auto-saved in the `backend/submissions.json` file.
