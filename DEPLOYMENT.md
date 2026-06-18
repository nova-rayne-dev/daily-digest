# Deployment Guide

This guide covers deploying BTWT Daily Digest to various platforms.

## Prerequisites

Before deploying:
1. Get an Anthropic API key from [console.anthropic.com](https://console.anthropic.com/account/keys)
2. Push your code to GitHub
3. Build the project: `npm run build` (verifies it works locally)

## Option 1: Railway (Recommended)

Railway automatically deploys your app whenever you push to GitHub and includes managed PostgreSQL, environment variable management, and automatic HTTPS.

### Step-by-step

1. **Create Railway account** at [railway.app](https://railway.app) (sign up with GitHub)

2. **Create new project**
   - Click "Create Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub account
   - Select your `btwt-daily-digest` repository

3. **Configure environment**
   - Click "Variables" in the Railway project
   - Click "Add Variable"
   - Name: `VITE_ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key
   - Click "Add"

4. **Deploy**
   - Railway auto-deploys when you push to GitHub
   - Check deployment status in the "Deployments" tab
   - Your app is live at `{project-name}.up.railway.app`

### Troubleshooting Railway

| Problem | Solution |
|---------|----------|
| Build fails | Check build logs: "Logs" tab → "Build" → Scroll for error message |
| "API key not configured" error | Verify `VITE_ANTHROPIC_API_KEY` is set in Railway Variables |
| App won't start | Check "Runtime" logs for errors; ensure Node.js 16+ |
| Port issues | Railway auto-assigns port 3000; no manual config needed |

## Option 2: Vercel

Vercel specializes in frontend deployments with edge functions and ultra-fast global CDN.

### Step-by-step

1. **Create Vercel account** at [vercel.com](https://vercel.com) (sign up with GitHub)

2. **Import project**
   - Click "Add New..." → "Project"
   - Select your GitHub account
   - Search for and select `btwt-daily-digest`
   - Click "Import"

3. **Configure environment**
   - In "Environment Variables" section:
   - Name: `VITE_ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key
   - Select production environment
   - Click "Add"

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live at `{project-name}.vercel.app`

### Troubleshooting Vercel

| Problem | Solution |
|---------|----------|
| Build error | Check build logs for Node version or dependency issues |
| 404 errors | Ensure Vite output is in `dist/` folder (auto-configured) |
| API key not working | Verify `VITE_ANTHROPIC_API_KEY` variable is in Production environment |

## Option 3: Docker (Local or Cloud)

Deploy using Docker for maximum control and portability.

### Build Docker image

```bash
docker build -t btwt-daily-digest .
```

### Run locally

```bash
docker run -p 3000:3000 \
  -e VITE_ANTHROPIC_API_KEY="your_api_key_here" \
  btwt-daily-digest
```

Access at [http://localhost:3000](http://localhost:3000)

### Deploy to cloud

**AWS ECS** — Push image to ECR, create ECS task with environment variables
**Google Cloud Run** — `gcloud run deploy ...` with `--set-env-vars` flag
**Azure Container Instances** — Deploy via Azure portal or CLI

## Option 4: Netlify

Netlify is simple and free for static sites, but requires a backend workaround for API calls.

### Step-by-step

1. Create account at [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variable `VITE_ANTHROPIC_API_KEY`
6. Deploy

**Note**: For API security, consider setting up Netlify Functions as a proxy to hide the API key.

## Option 5: Self-hosted (VPS)

For full control, deploy to your own server.

### Prerequisites
- Linux server (Ubuntu 20.04+ recommended)
- Node.js 16+ installed
- nginx or Apache for reverse proxy

### Setup

```bash
# SSH into your server
ssh user@your-server

# Clone repository
git clone <your-repo-url>
cd btwt-daily-digest

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API key
nano .env

# Build
npm run build

# Install PM2 for process management
npm install -g pm2

# Start app with PM2
pm2 start npm --name "btwt-digest" -- start

# Auto-restart on reboot
pm2 startup
pm2 save
```

### nginx reverse proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable with:
```bash
sudo ln -s /etc/nginx/sites-available/btwt /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

## Environment Variable Reference

| Variable | Required | Where to set | Example |
|----------|----------|--------------|---------|
| `VITE_ANTHROPIC_API_KEY` | Yes | Railway Variables / Vercel Env / Docker `-e` | `sk-ant-v1-...` |

## Monitoring Deployments

### View logs

**Railway**: Click "Logs" tab
**Vercel**: Click "Deployments" → Select deployment → "Logs"
**Docker**: `docker logs <container-id>`
**Self-hosted**: `pm2 logs btwt-digest`

### Test deployment

After deploying, test at your app URL:
1. Navigate to app
2. Fill in form (date auto-fills)
3. Add hours: `5`
4. Add notes: `Test task - checking deployment`
5. Click "Format for Nicole →"
6. Verify output appears without errors

## Rollback

**Railway/Vercel**: Each deployment is versioned; select previous version from UI
**Docker**: Tag images with version numbers and roll back with `docker run IMAGE:version`
**Self-hosted**: Use `git checkout <commit>` and rebuild

## Domain & SSL

**Railway/Vercel**: Free HTTPS auto-configured; custom domain in project settings
**Self-hosted + nginx**: Use Let's Encrypt: `sudo apt install certbot nginx-certbot` then `sudo certbot --nginx`

## Performance

- Production build is ~200 KB gzipped
- Deploys in <2 minutes on Railway/Vercel
- No database or backend required (API calls go directly to Anthropic)
- CDN-served from edge locations (Vercel, Netlify)

## Cost

| Platform | Free tier | Typical cost |
|----------|-----------|--------------|
| Railway | $5 credit/month | $5-20/month |
| Vercel | Unlimited static | Free-$20/month |
| Netlify | Unlimited static | Free-$20/month |
| Self-hosted VPS | N/A | $5-50/month |

Only cost is your Anthropic API usage (pay-as-you-go).

## Maintenance

### Update dependencies
```bash
npm update
npm run build  # Test before deploying
git push      # Auto-deploys on Railway/Vercel
```

### Monitor API usage
Check at [console.anthropic.com](https://console.anthropic.com/account/settings/usage)

### Enable debug logging
Set `DEBUG=*` environment variable to see verbose logs
