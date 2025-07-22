# SalonConnect Deployment Guide 🚀

This guide covers how to deploy SalonConnect to Render's free tier for zero-cost hosting.

## Prerequisites

- GitHub account
- Render account (free)
- Basic understanding of environment variables

## Deployment Steps

### 1. Prepare Your Repository

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: SalonConnect platform"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### 2. Deploy to Render

#### Option A: Using render.yaml (Recommended)

1. **Connect GitHub to Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Select the repository with your SalonConnect code

2. **Render will automatically detect the `render.yaml` file** and create:
   - PostgreSQL database (free tier)
   - Web service for the API (free tier)
   - Static site for the frontend (free tier)

#### Option B: Manual Setup

If you prefer to set up services manually:

##### 2.1 Create PostgreSQL Database

1. In Render Dashboard → "New" → "PostgreSQL"
2. Configure:
   - **Name**: `salon-connect-db`
   - **Database**: `salon_connect`
   - **User**: `salon_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free

##### 2.2 Create API Web Service

1. In Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `salon-connect-api`
   - **Environment**: `Docker`
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

4. **Environment Variables**:
   ```
   DATABASE_URL=<from-database-connection-string>
   JWT_SECRET=<generate-strong-secret>
   NODE_ENV=production
   PORT=10000
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
   CLOUDINARY_API_KEY=<your-cloudinary-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-secret>
   ```

##### 2.3 Create Frontend Static Site

1. In Render Dashboard → "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `salon-connect-web`
   - **Branch**: `main`
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `out`

4. **Environment Variables**:
   ```
   API_URL=<your-api-service-url>
   NODE_ENV=production
   ```

### 3. Database Setup

After your API service is deployed:

1. **Access your API service terminal** (in Render dashboard)
2. **Run database migrations**:
   ```bash
   npx prisma migrate deploy
   ```
3. **Seed the database** (optional):
   ```bash
   npm run db:seed --workspace=packages/database
   ```

### 4. Custom Domain (Optional)

1. In your Static Site settings → "Settings" → "Custom Domains"
2. Add your domain
3. Configure DNS records as instructed by Render

## Environment Variables Reference

### API Service Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret for JWT tokens | Yes | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | JWT expiration time | No | `7d` |
| `NODE_ENV` | Environment mode | Yes | `production` |
| `PORT` | Server port | No | `10000` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | No | `your-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | No | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | No | `your-secret` |
| `OPENAI_API_KEY` | OpenAI API key for AI features | No | `sk-...` |

### Frontend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `API_URL` | Backend API URL | Yes | `https://your-api.onrender.com/api` |
| `NODE_ENV` | Environment mode | Yes | `production` |

## Free Tier Limitations

### Render Free Tier Includes:
- **Web Services**: 750 hours/month (enough for 1 service running 24/7)
- **Static Sites**: Unlimited
- **PostgreSQL**: 1GB storage, 1 million rows
- **Bandwidth**: 100GB/month

### Limitations:
- Services sleep after 15 minutes of inactivity
- Cold start time: 10-30 seconds when waking up
- Limited to 1 concurrent build

## Performance Tips

1. **Optimize Docker Image**:
   - Use multi-stage builds (already implemented)
   - Minimize dependencies in production

2. **Database Optimization**:
   - Use connection pooling
   - Add appropriate indexes
   - Regular cleanup of old data

3. **Frontend Optimization**:
   - Enable image optimization
   - Use static site generation where possible
   - Implement proper caching headers

## Monitoring and Maintenance

### Health Checks

1. **API Health**: `https://your-api.onrender.com/health`
2. **Database Connection**: Monitor via API logs
3. **Frontend**: Use Render's built-in monitoring

### Logs

- **API Logs**: Available in Render dashboard → Service → Logs
- **Build Logs**: Available during deployment
- **Error Tracking**: Consider integrating Sentry (free tier available)

### Backup Strategy

1. **Database Backups**: 
   - Render automatically backs up PostgreSQL
   - Consider periodic manual exports
   
2. **Code Backups**:
   - GitHub serves as primary backup
   - Tag releases for easy rollbacks

## Scaling Up

When you're ready to scale beyond free tier:

1. **Upgrade Database**: More storage and concurrent connections
2. **Upgrade Web Service**: Remove sleep limitations, more resources
3. **Add CDN**: For faster global content delivery
4. **Load Balancer**: For multiple API instances

## Troubleshooting

### Common Issues:

1. **Service Won't Start**:
   - Check environment variables
   - Verify database connection
   - Review build logs

2. **Database Connection Errors**:
   - Verify DATABASE_URL format
   - Check database service status
   - Ensure proper network access

3. **Frontend Can't Reach API**:
   - Verify API_URL environment variable
   - Check CORS configuration
   - Ensure API service is running

4. **Build Failures**:
   - Check package.json scripts
   - Verify dependencies
   - Review build logs in detail

### Support Resources:

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [GitHub Issues](https://github.com/your-repo/issues)

---

## Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Database service deployed
- [ ] API service deployed with correct environment variables
- [ ] Frontend static site deployed
- [ ] Database migrations run
- [ ] Test all endpoints
- [ ] Verify frontend can communicate with API
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring alerts

Your SalonConnect platform should now be live and accessible to users worldwide! 🎉