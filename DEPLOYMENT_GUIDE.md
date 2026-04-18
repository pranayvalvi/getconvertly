# 🚀 Convertly Deployment Guide

This guide will walk you through launching the Convertly project onto the internet completely for free. We will put the **frontend on Vercel** and the **backend on Render**.

---

## Step 1: Push Code to GitHub

Because we are deploying to cloud providers, they need to pull your code directly from a GitHub repository.

1. Create a free account on [GitHub](https://github.com/) if you don't have one.
2. Click **New Repository** (the `+` icon top right).
3. Name it `convertly` and leave it Public or Private (your choice). Create the repository without a README.
4. Open the terminal in your `getconvertly` project folder on your computer and run these exact commands (copying the URL GitHub gives you):

```bash
git init
git add .
git commit -m "Convertly Launch Ready"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/convertly.git
git push -u origin main
```

*(Note: We already added a `.gitignore` so your `.env` secrets and heavy node_modules won't be pushed).*

---

## Step 2: Deploy the Backend API (Render)

We will deploy the Node.js backend to Render because it handles heavy file processing exceptionally well on the free tier.

1. Go to [Render.com](https://render.com/) and sign up with your GitHub account.
2. Click **New +** and select **Web Service**.
3. It will ask to connect a repository. Select your `convertly` repository.
4. **Important Configurations:**
   - **Name:** `convertly-api` (or anything)
   - **Root Directory:** Type exactly `convertly-backend` (This is crucial!).
   - **Build Command:** It should automatically say `npm install`.
   - **Start Command:** It should say `node server.js` (you can type this in if it doesn't).
   - **Instance Type:** Select the **Free** tier.
5. Create the web service! 

**Wait for it to deploy.** Once it says "Live", copy the URL they give you at the top left of the screen (e.g., `https://convertly-api.onrender.com`). You will need this for Vercel.

---

## Step 3: Deploy the Frontend Website (Vercel)

We will deploy the React application to Vercel because it is heavily optimized for Vite/React applications.

1. Go to [Vercel.com](https://vercel.com/) and sign up with your GitHub account.
2. Click **Add New Project**.
3. Import your `convertly` repository.
4. **Important Configurations:**
   - **Framework Preset:** Vite
   - **Root Directory:** Click "Edit" and select the `convertly` folder.
   - Expand the **Environment Variables** section.
     - Add a New Variable:
     - **Name:** `VITE_API_URL`
     - **Value:** Paste the URL you got from Render in Step 2 (e.g., `https://convertly-api.onrender.com`). *Make sure there is no `/` at the very end of the URL!*
5. Click **Deploy**!

Vercel will build the frontend and provide you with a live `.vercel.app` website link. Note this link down!

---

## Step 4: Final Security Lock (CORS)

Currently, your backend on Render doesn't know the exact address of your new Vercel website, so it might block it for security reasons. Let's fix that.

1. Go back to your Backend Dashboard on **Render.com**.
2. Click on your `convertly-api` Web Service.
3. On the left side menu, click **Environment**.
4. Click **Add Environment Variable**:
   - **Key:** `FRONTEND_URL`
   - **Value:** Paste your Vercel website link (e.g., `https://convertly-app.vercel.app`). *No `/` at the end!*
5. Save Changes. This will automatically restart your backend.

---

### 🎉 Done!
Go to your Vercel URL! Convertly is now 100% fully deployed and accessible to anyone on the internet!
