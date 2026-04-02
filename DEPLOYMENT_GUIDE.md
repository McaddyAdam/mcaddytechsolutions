# Deploying Mcaddy Tech Solutions to Production

Since you have upgraded your website from a purely static HTML site to a full **Node.js Web Application** with an Express backend, your hosting strategy needs to change.

## 1. Why GitHub Pages Won't Work Anymore
I noticed you have a `CNAME` file and a GitHub repository link (`McaddyAdam/mcaddytechsolutions`). This indicates you previously used **GitHub Pages** to host your static site.

**The Catch:** GitHub Pages can *only* host static frontend files (HTML/CSS/JS). It cannot run a Node.js server (`server.js`). If you upload this new code to GitHub Pages, the frontend will show up, but your backend API (`/api/contact`) will be completely dead, and forms will not work.

## 2. Recommended Hosting Platforms
To host a Node.js server, you need a cloud provider. Here are the best beginner-friendly, free/low-cost options that integrate directly with your GitHub repository:

### Option A: Render (Highest Recommendation)
* **Cost:** Free Tier available.
* **Ease of Use:** Extremely easy. You connect your GitHub account, select the repository, and it automatically builds and runs `node server.js`.
* **Custom Domain:** You can easily map `www.mcaddytechsolutions.com` in their settings.

### Option B: Railway.app or Heroku
* **Cost:** Small monthly fee (few dollars).
* **Pros:** Highly reliable, does not "sleep" after inactivity like free tiers do.

## 3. 🚨 CRITICAL CLOUD WARNING: The Data Loss Problem
Currently, our backend saves form data to a local file called `submissions.json`. 

When you host an app on cloud platforms like Render or Heroku, they use **Ephemeral Filesystems**. This means every time the server restarts, undergoes maintenance, or deploys an update, **your `submissions.json` file will be completely wiped out and reset to zero.** You will lose all your customer requests.

### How to Fix This Before Deploying:
Before you launch this to `www.mcaddytechsolutions.com`, we **must** upgrade your storage method. We have two great options:

1. **Cloud Database (MongoDB Atlas):** We can replace `submissions.json` with a free cloud database. The data will live safely in the cloud forever, and I can set this up for you very quickly.
2. **Email Forwarding (Nodemailer):** Instead of saving to a file, we can configure the Node.js server to instantly forward the submitted forms directly to your email address (e.g., `info@mcaddytechsolutions.com`).

---

## Next Steps

1. Decide how you want to handle the form data in production (Database vs. Email).
2. Create an account on [Render.com](https://render.com/).
3. Connect your GitHub repository to Render and deploy it as a "Web Service".
4. Update your Domain Registrar (Godaddy, Namecheap, etc.) DNS settings to point to the Render server.
