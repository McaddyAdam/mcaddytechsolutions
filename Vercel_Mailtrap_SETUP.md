# Vercel + Mailtrap Setup for Mcaddy Tech Solutions

This guide explains how to deploy the repository to Vercel and configure Mailtrap for email delivery.

## 1. Remove MongoDB and Render Dependencies

This project no longer uses MongoDB or Render. The backend now sends form submissions through Mailtrap.

## 2. Vercel Deployment

1. Go to [https://vercel.com/](https://vercel.com/) and log in.
2. Create a new project and import the `mcaddytechsolutions` repository from GitHub.
3. Set the **Framework Preset** to `Other`.
4. Leave the **Build Command** empty or use:
   ```bash
   npm run vercel-build
   ```
5. Leave the **Output Directory** empty.

## 3. Mailtrap Environment Variables

Add the following environment variables under your Vercel project settings:

- `MAILTRAP_HOST` = `smtp.mailtrap.io`
- `MAILTRAP_PORT` = `2525`
- `MAILTRAP_USER` = `<your Mailtrap username>`
- `MAILTRAP_PASS` = `<your Mailtrap password>`
- `MAIL_FROM` = `no-reply@mcaddytechsolutions.com`
- `MAILTRAP_TO` = `contact@mcaddytechsolutions.com`

If you use a custom Mailtrap SMTP host or port, update `MAILTRAP_HOST` and `MAILTRAP_PORT` accordingly.

## 4. Backend API Endpoints

The backend exposes the following endpoints via Vercel:

- `/api/contact`
- `/api/quote`
- `/api/newsletter`

All form submissions are now sent through Mailtrap instead of being stored in a database.

## 5. Local Testing

To test locally, run:

```bash
npm install
node backend/server.js
```

Then submit a form from the frontend. The backend will send email through Mailtrap using your environment variables.

## 6. Important Notes

- Remove any old `MONGODB_URI` or `render` references from your environment and docs.
- Ensure `vercel.json` exists in the repo root so API routing works.
- If you want to receive actual email in production, replace `MAILTRAP_TO` with your real business email address.
