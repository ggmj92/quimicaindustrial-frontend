# Deployment Fix: Categories Not Loading

## Problem

Categories are not loading on the deployed frontend because the API URL defaults to `localhost` when environment variables aren't set.

## Solution Applied

Updated `/src/data/qiApi.ts` to use the production Render URL as the default:

```typescript
const API_BASE =
  import.meta.env.PUBLIC_QI_API_URL ||
  "https://oregonchem-backend.onrender.com/api/qi";
```

## Deploy Instructions

### Option 1: Quick Fix (Already Applied)

The code now defaults to your Render backend URL, so you can simply redeploy:

```bash
cd /Users/ggmj/Development/quimicaindustrial-frontend
git add .
git commit -m "Fix: Use production API URL as default"
git push
```

Your hosting platform (Vercel/Netlify) will auto-deploy.

### Option 2: Set Environment Variable (Recommended for Production)

For better control, set the environment variable in your hosting platform:

#### If using Vercel:

1. Go to your project dashboard
2. Settings → Environment Variables
3. Add: `PUBLIC_QI_API_URL` = `https://oregonchem-backend.onrender.com/api/qi`
4. Redeploy

#### If using Netlify:

1. Go to Site settings → Build & deploy → Environment
2. Add: `PUBLIC_QI_API_URL` = `https://oregonchem-backend.onrender.com/api/qi`
3. Trigger redeploy

## Testing

After deployment, check:

1. Homepage categories section loads
2. Products page sidebar shows categories
3. Browser console shows: `🔍 QI API Base URL: https://oregonchem-backend.onrender.com/api/qi`

## Local Development

For local development, the `.env` file will still work:

```env
PUBLIC_QI_API_URL=http://localhost:5001/api/qi
```

This allows you to test against your local backend when needed.
