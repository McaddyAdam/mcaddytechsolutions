# Render.com Deployment Guide for Mcaddy Tech Solutions

This guide covers exactly how to deploy your newly created Node.js website to Render step-by-step, and how to link your custom domain (`www.mcaddytechsolutions.com`).

> [!CAUTION]
> **Data Loss Warning**: Because Render uses an ephemeral filesystem, any form submissions saved to `submissions.json` will be deleted every time Render restarts or updates your server. Before relying on this in production, you should migrate to a Cloud Database (like MongoDB) or Direct Email Forwarding.

---

## Phase 1: Push Your Code to GitHub
Render connects directly to your GitHub to pull code.
1. Open your terminal in VS Code.
2. Commit and push your recent changes (the new `frontend` and `backend` structure) to your GitHub repository (`McaddyAdam/mcaddytechsolutions`).
   ```bash
   git add .
   git commit -m "Restructured frontend and backend"
   git push origin main
   ```

## Phase 2: Set Up Render
1. Go to [Render.com](https://render.com/) and create a free account (sign up using your GitHub account for easy access).
2. Once logged into the dashboard, click the **New +** button at the top right and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and click Next.
4. Render will ask you to connect your GitHub account. Connect it and authorize access to your `mcaddytechsolutions` repository.
5. Select your repository from the list and click **Connect**.

## Phase 3: Configure Render Settings
Because we split your app into a `frontend` and `backend` directory, we need to instruct Render exactly how to run it. Fill out the configuration page exactly like this:

- **Name:** `mcaddytechsolutions-web` (or whatever you like)
- **Region:** Choose whatever is closest to you.
- **Branch:** `main`
- **Root Directory:** Leave this **completely blank**.
- **Runtime:** `Node`
- **Build Command:** `cd backend && npm install`
- **Start Command:** `cd backend && node server.js`

Scroll down and make sure the **Free** instance type is selected. (Note: Free instances go to "sleep" after 15 minutes of inactivity and take about 30-50 seconds to wake up when someone visits).

Click **Create Web Service**. 
Render will now start building your app. You'll see terminal logs running on the screen. Wait a few minutes until it says **"Live"** with a green checkmark!

## Phase 4: Connecting Your Custom Domain
Now that Render is hosting your site on a `.onrender.com` URL, we need to bring your domain (`www.mcaddytechsolutions.com`) over to it.

1. On your Render Web Service dashboard, click **Settings** on the left menu.
2. Scroll down to the **Custom Domains** section.
3. Click **Add Custom Domain** and type: `www.mcaddytechsolutions.com`
4. Click **Save**.

Render will now show you a **CNAME Record** (it will look something like `your-app-name.onrender.com`).

### Go to your Domain Registrar (Where you bought the domain):
1. Log in to your domain registrar (e.g., GoDaddy, Namecheap, Google Domains).
2. Find the **DNS Settings / DNS Management** for `mcaddytechsolutions.com`.
3. If you have an old CNAME or A Record pointing to GitHub Pages (`mcaddyadam.github.io`), **delete it**.
4. Add a new record:
   - **Type:** `CNAME`
   - **Name / Host:** `www`
   - **Value / Target:** Pass in the `.onrender.com` URL provided by Render.
5. (Optional but recommended): Render will also give you an Alias/A-Record for the root domain (`mcaddytechsolutions.com` without the `www`). Add that to your registrar so both work!

> [!NOTE]
> DNS changes can take anywhere from a few minutes up to 48 hours to propagate globally. Once it updates, Render will automatically issue a free SSL certificate so your site says "Secure/HTTPS".
