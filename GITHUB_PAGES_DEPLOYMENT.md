# SalonConnect - GitHub Pages Deployment Guide 🚀

## ✅ Configuration Complete

Your SalonConnect frontend is now configured for GitHub Pages deployment with automatic GitHub Actions!

## 🔧 What's Been Configured:

### **Next.js Configuration**
- ✅ Static export enabled (`output: 'export'`)
- ✅ Base path set to `/salon-connect` for GitHub Pages
- ✅ API URL configured: `https://salon-connect-api.onrender.com/api`
- ✅ Image optimization disabled (required for static hosting)

### **GitHub Actions Workflow**
- ✅ Automatic deployment on push to `main` branch
- ✅ Builds and deploys to GitHub Pages
- ✅ Production environment variables set

## 📋 Deployment Steps:

### **Step 1: Push Your Code**
```bash
git add .
git commit -m "Configure frontend for GitHub Pages deployment"
git push origin main
```

### **Step 2: Enable GitHub Pages**
1. Go to your GitHub repository
2. Click **Settings** tab
3. Scroll to **Pages** section
4. Under **Source**, select **GitHub Actions**
5. Save the configuration

### **Step 3: Automatic Deployment**
- The GitHub Action will automatically trigger on your next push
- Monitor the deployment in the **Actions** tab
- First deployment takes ~3-5 minutes

## 🌐 Your URLs After Deployment:

- **Frontend**: `https://[your-username].github.io/salon-connect/`
- **API**: `https://salon-connect-api.onrender.com/api`

## 🔄 How It Works:

1. **Push to main branch** → Triggers GitHub Action
2. **GitHub Action builds** → Runs `npm run build` with production config
3. **Static files generated** → In `apps/web/out` directory  
4. **Deploy to Pages** → Automatically published to GitHub Pages

## 🛠️ Next Steps:

### **Database Setup** (Required)
Your API is deployed but needs database setup:

1. **Go to Render Dashboard** → Find your `salon-connect-api` service
2. **Open Shell** → Click the "Shell" tab
3. **Run migrations**:
   ```bash
   npx prisma migrate deploy --schema=./packages/database/prisma/schema.prisma
   ```
4. **Seed database** (optional):
   ```bash
   npm run seed
   ```

### **Test Your Application**
1. **API Health Check**: Visit `https://salon-connect-api.onrender.com/health`
2. **API Salons**: Visit `https://salon-connect-api.onrender.com/api/salons`
3. **Frontend**: Visit `https://[your-username].github.io/salon-connect/`

## 🚨 Important Notes:

- **Cold Start**: Render free tier services sleep after 15 minutes
- **First Load**: May take 10-30 seconds to wake up
- **HTTPS Required**: GitHub Pages uses HTTPS, API must support CORS

## 🔧 Troubleshooting:

### **If GitHub Actions Fails:**
1. Check the **Actions** tab for error details
2. Ensure **Pages** is enabled in repository settings
3. Verify **permissions** are set correctly in workflow

### **If Frontend Can't Reach API:**
1. Check API is running: `https://salon-connect-api.onrender.com/health`
2. Verify CORS settings in API
3. Check browser console for errors

### **For Local Development:**
- API URL automatically switches to localhost in development
- Use `npm run dev` in `apps/web` for local testing

---

## 🎉 Ready to Deploy!

Your SalonConnect platform is ready for GitHub Pages! Just push your code and enable Pages in your repository settings.

**Estimated deployment time**: 5-10 minutes after first push!