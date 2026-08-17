# Deploying Mcaddy Tech Solutions to Production

Since you have upgraded your website from a purely static HTML site to a full **Node.js Web Application** with an Express backend, your hosting strategy needs to change.

## 1. Why GitHub Pages Won't Work Anymore
I noticed you have a `CNAME` file and a GitHub repository link (`McaddyAdam/mcaddytechsolutions`). This indicates you previously used **GitHub Pages** to host your static site.

**The Catch:** GitHub Pages can *only* host static frontend files (HTML/CSS/JS). It cannot run a Node.js server (`server.js`). If you upload this new code to GitHub Pages, the frontend will show up, but your backend API (`/api/contact`) will be completely dead, and forms will not work.

## 2. Recommended Hosting Platforms
To host a Node.js server, you need a cloud provider. Here are the best beginner-friendly, free/low-cost options that integrate directly with your GitHub repository:

### Option A: Vercel (Recommended)
* **Cost:** Free Tier available.
* **Ease of Use:** Very easy for static sites and Node.js API functions.
* **Custom Domain:** Use Vercel's domain setup and point your DNS to Vercel.

### Option B: Railway.app or Heroku
* **Cost:** Small monthly fee (few dollars).
* **Pros:** Highly reliable, does not "sleep" after inactivity like free tiers do.

## 3. � Vercel + Mailtrap Hosting
Your app is now designed for Vercel deployment with email delivery via Mailtrap. Forms are sent through the backend API and do not rely on a database.

### Required Vercel environment variables
Add these values in your Vercel project settings:

- `MAILTRAP_HOST` = `smtp.mailtrap.io`
- `MAILTRAP_PORT` = `2525`
- `MAILTRAP_USER` = `<your Mailtrap username>`
- `MAILTRAP_PASS` = `<your Mailtrap password>`
- `MAIL_FROM` = `no-reply@mcaddytechsolutions.com`
- `MAILTRAP_TO` = `contact@mcaddytechsolutions.com`

### Why this setup is safer
- No local file storage (`submissions.json`) is used in production.
- No MongoDB database is required.
- Mailtrap captures outgoing emails for testing before you switch to a real SMTP account.

---

## Next Steps

1. Create an account on [Vercel.com](https://vercel.com/).
2. Connect your GitHub repository to Vercel and deploy it using the `/api` functions and `vercel.json` routing.
3. Add the Mailtrap environment variables listed above.
4. Update your DNS settings with your domain registrar once the Vercel deployment is live.
