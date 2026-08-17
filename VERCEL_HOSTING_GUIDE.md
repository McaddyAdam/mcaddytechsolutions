# Vercel Deployment Guide for Mcaddy Tech Solutions

This guide covers how to deploy your Node.js website to Vercel and link your custom domain (`www.mcaddytechsolutions.com`).

> [!CAUTION]
> **Change Notice**: This site now sends all form submissions through Mailtrap and is deployed on Vercel. Remove any MongoDB configuration and do not use Render.
>
---

## Phase 1: Push Your Code to GitHub
Vercel connects directly to your GitHub repository.
1. Open your terminal in VS Code.
2. Commit and push your recent changes to GitHub.
   ```bash
   git add .
   git commit -m "Add Vercel deployment configuration"
   git push origin main
   ```

## Phase 2: Set Up Vercel
1. Go to [Vercel.com](https://vercel.com/) and create a free account.
2. Once logged in, click **New Project**.
3. Choose **Import Git Repository** and connect your GitHub account.
4. Select the `mcaddytechsolutions` repository.

## Phase 3: Configure Vercel Project
1. In the Vercel project settings, verify the root directory is your repository root.
2. Set the **Framework Preset** to **Other**.
3. Ensure the **Build Command** is empty or set to `npm run vercel-build`.
4. Set the **Output Directory** to `frontend` (this is also enforced by `vercel.json`).
5. Add the following environment variables in Vercel:
   - `MAILTRAP_API_TOKEN` = `<your Mailtrap API token>`
   - `MAILTRAP_SANDBOX_ID` = `<your sandbox ID>` (optional, defaults to 0)
   - `MAIL_FROM` = `no-reply@mcaddytechsolutions.com`
   - `MAILTRAP_TO` = `admin@mcaddytechsolutions.com`

Vercel will discover the `vercel.json` file and the `/api` folder, which means your backend API routes will work automatically.

## Phase 4: Deploy and Verify
1. Click **Deploy**.
2. Wait for the deployment to complete. Your frontend will be served from Vercel, and the backend endpoints will be available under `/api/contact`, `/api/quote`, and `/api/newsletter`.

## Phase 5: Link Your Custom Domain
1. In the Vercel dashboard for your project, open the **Domains** tab.
2. Add `www.mcaddytechsolutions.com`.
3. Follow Vercel's DNS instructions for your domain provider.

> [!NOTE]
> DNS propagation may take up to 48 hours. Vercel will automatically provision HTTPS once your domain is verified.
