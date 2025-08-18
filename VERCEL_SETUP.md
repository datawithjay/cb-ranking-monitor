# 🚀 Vercel Deployment Guide

## ✅ Prerequisites Completed
- [x] Git repository initialized
- [x] All files committed
- [x] Vercel account created
- [x] Scheduled scraping API endpoint ready
- [x] vercel.json configuration file created

## 📋 **Step-by-Step Deployment**

### **Step 1: Push to GitHub**

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Repository name: `coinbase-ranking-monitor` (or your choice)
   - Set to **Public** (required for free Vercel)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

2. **Connect your local repository to GitHub:**
   ```bash
   # Replace YOUR_USERNAME with your GitHub username
   git remote add origin https://github.com/YOUR_USERNAME/coinbase-ranking-monitor.git
   git branch -M main
   git push -u origin main
   ```

### **Step 2: Deploy to Vercel**

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click "New Project"

2. **Import from GitHub:**
   - Click "Import Git Repository"
   - Select your `coinbase-ranking-monitor` repository
   - Click "Import"

3. **Project Configuration:**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (auto-filled)
   - **Output Directory:** `.next` (auto-filled)
   - **Install Command:** `npm install` (auto-filled)
   - Click "Deploy"

### **Step 3: Environment Variables**

⚠️ **IMPORTANT:** Add these environment variables in Vercel:

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Environment Variables

2. **Add these variables:**

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   
   # Cron Security (generate a random string)
   CRON_SECRET=your_random_secret_here_123456789
   ```

3. **Where to find Supabase credentials:**
   - Go to your Supabase project dashboard
   - Settings → API
   - Copy the values from there

### **Step 4: Enable Cron Jobs**

1. **Upgrade Vercel plan (if needed):**
   - Cron jobs require **Pro plan** ($20/month)
   - Or use GitHub Actions (free alternative)

2. **Verify cron is working:**
   - Check Vercel Functions tab
   - Look for `/api/scheduled-scrape` function
   - Check logs for hourly executions

### **Step 5: Test Your Deployment**

1. **Dashboard Test:**
   - Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
   - Verify dashboard loads correctly
   - Check that charts render

2. **Manual Scrape Test:**
   - Visit: `https://your-project.vercel.app/api/scheduled-scrape`
   - Should see: `{"message": "Coinbase Scheduler Endpoint"...}`
   - Test POST request with:
     ```bash
     curl -X POST https://your-project.vercel.app/api/scheduled-scrape \
          -H "Authorization: Bearer your_cron_secret_here"
     ```

## 🆓 **Free Alternative: GitHub Actions**

If you prefer not to pay for Vercel Pro, use GitHub Actions:

1. **Create GitHub Action:**
   - Create `.github/workflows/scraper.yml` in your repository
   - See DEPLOYMENT.md for full configuration

2. **Benefits:**
   - Completely free
   - Runs on GitHub's infrastructure
   - Same reliability as paid services

## 🎯 **What You'll Have After Deployment**

- ✅ **Live Dashboard:** `https://your-project.vercel.app`
- ✅ **Automatic Scraping:** Every hour at minute 0
- ✅ **Global CDN:** Fast loading worldwide
- ✅ **HTTPS:** Automatic SSL certificate
- ✅ **Custom Domain:** (optional) Add your own domain
- ✅ **Auto-deployments:** Push to GitHub = instant deploy

## 🔧 **Troubleshooting**

### Build Errors:
- Check that `next.config.cjs` is properly configured
- Verify all dependencies in `package.json`

### Environment Variables:
- Double-check Supabase credentials
- Ensure CRON_SECRET is set

### Cron Not Working:
- Verify you're on Vercel Pro plan
- Check Function logs in Vercel dashboard

## 📞 **Need Help?**

Share with me:
1. Your GitHub repository URL
2. Your Vercel project URL
3. Any error messages you see

Let's get your dashboard live! 🚀
