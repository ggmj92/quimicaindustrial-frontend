# 🚀 Complete Deployment Guide

## Química Industrial Frontend → Vercel + MailerLite + punto.pe

---

## 📋 **PRE-DEPLOYMENT CHECKLIST**

### ✅ **What's Ready:**

- [x] Frontend built with Astro
- [x] Backend deployed on Render
- [x] Quote form with email integration
- [x] Banner carousel with Firebase Storage
- [x] Product catalog with MongoDB
- [x] Category filtering
- [x] Shopping cart for quotes

### 🔧 **What We'll Configure:**

1. Frontend environment variables for production
2. Backend SMTP settings on Render
3. DNS records on punto.pe
4. Domain verification on MailerLite
5. Vercel deployment

---

## 🎯 **STEP 1: PREPARE FRONTEND FOR PRODUCTION**

### **1.1 Update Environment Variables**

**File:** `/Users/ggmj/Development/quimicaindustrial-frontend/.env`

```env
# Production Backend API
PUBLIC_QI_API_URL=https://oregonchem-backend.onrender.com/api/qi
```

**Action Required:**

```bash
cd /Users/ggmj/Development/quimicaindustrial-frontend
```

Update `.env` to use production backend URL (already done in this guide).

---

### **1.2 Commit and Push to GitHub**

```bash
# Make sure you're in the frontend directory
cd /Users/ggmj/Development/quimicaindustrial-frontend

# Check status
git status

# Add all changes
git add .

# Commit
git commit -m "Production ready: Quote form, banner carousel, Firebase Storage"

# Push to GitHub
git push origin main
```

**✅ Checkpoint:** Code is on GitHub and ready for Vercel

---

## 🌐 **STEP 2: DEPLOY TO VERCEL**

### **2.1 Connect GitHub Repository**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose: `quimicaindustrial-frontend` (or your repo name)
5. Click **"Import"**

### **2.2 Configure Project Settings**

**Framework Preset:** Astro  
**Root Directory:** `./` (leave as default)  
**Build Command:** `npm run build` (auto-detected)  
**Output Directory:** `dist` (auto-detected)

### **2.3 Add Environment Variables**

In Vercel project settings → **Environment Variables**, add:

| Name                | Value                                            |
| ------------------- | ------------------------------------------------ |
| `PUBLIC_QI_API_URL` | `https://oregonchem-backend.onrender.com/api/qi` |

### **2.4 Deploy**

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. You'll get a temporary URL like: `quimicaindustrial-frontend-xyz.vercel.app`

**✅ Checkpoint:** Site is live on Vercel temporary URL

---

## 📧 **STEP 3: CONFIGURE MAILERLITE**

### **3.1 Add Domain for Email Sending**

1. Go to [MailerLite Dashboard](https://dashboard.mailerlite.com)
2. Navigate to: **Settings** → **Domains**
3. Click **"Add Domain"**
4. Enter: `quimicaindustrial.pe`
5. Click **"Add Domain"**

### **3.2 Get DNS Records from MailerLite**

MailerLite will show you DNS records to add. They look like this:

**Example DNS Records (yours will be different):**

| Type    | Name            | Value                                               | Priority |
| ------- | --------------- | --------------------------------------------------- | -------- |
| `TXT`   | `_mailerlite`   | `verification-code-here`                            | -        |
| `CNAME` | `ml._domainkey` | `ml._domainkey.mailerlite.com`                      | -        |
| `TXT`   | `@`             | `v=spf1 include:_spf.mailerlite.com ~all`           | -        |
| `TXT`   | `_dmarc`        | `v=DMARC1; p=none; rua=mailto:dmarc@mailerlite.com` | -        |

**⚠️ IMPORTANT:** Copy these EXACT records from your MailerLite dashboard. The values above are examples only.

**✅ Checkpoint:** You have the DNS records from MailerLite ready to add

---

## 🌍 **STEP 4: CONFIGURE DNS ON PUNTO.PE**

### **4.1 Access punto.pe DNS Management**

1. Go to [punto.pe](https://www.punto.pe)
2. Log in to your account
3. Go to **"Mis Dominios"** or **"My Domains"**
4. Click on `quimicaindustrial.pe`
5. Find **"DNS"** or **"Gestión DNS"** section

### **4.2 Add Vercel DNS Records**

**Get Vercel's DNS Records:**

1. In Vercel project → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter: `www.quimicaindustrial.pe`
4. Vercel will show you DNS records to add

**Typical Vercel DNS Records:**

| Type    | Name/Host | Value/Points To        | TTL  |
| ------- | --------- | ---------------------- | ---- |
| `A`     | `@`       | `76.76.21.21`          | 3600 |
| `CNAME` | `www`     | `cname.vercel-dns.com` | 3600 |

**⚠️ Use the EXACT values Vercel gives you, not these examples!**

### **4.3 Add MailerLite DNS Records**

Add the DNS records from Step 3.2 to punto.pe:

**For TXT Records:**

- **Type:** TXT
- **Name/Host:** (from MailerLite, e.g., `_mailerlite`, `@`, `_dmarc`)
- **Value:** (exact value from MailerLite)
- **TTL:** 3600 (or default)

**For CNAME Records:**

- **Type:** CNAME
- **Name/Host:** (from MailerLite, e.g., `ml._domainkey`)
- **Value:** (exact value from MailerLite)
- **TTL:** 3600 (or default)

### **4.4 punto.pe Configuration Summary**

Based on your screenshot, you'll need to add these records in punto.pe:

**DNS Records to Add:**

```
1. A Record (Vercel)
   - Type: A
   - Host: @
   - Value: [Vercel's IP from their dashboard]
   - TTL: 3600

2. CNAME Record (Vercel www)
   - Type: CNAME
   - Host: www
   - Value: cname.vercel-dns.com
   - TTL: 3600

3. TXT Record (MailerLite Verification)
   - Type: TXT
   - Host: _mailerlite
   - Value: [Your verification code from MailerLite]
   - TTL: 3600

4. CNAME Record (MailerLite DKIM)
   - Type: CNAME
   - Host: ml._domainkey
   - Value: ml._domainkey.mailerlite.com
   - TTL: 3600

5. TXT Record (SPF)
   - Type: TXT
   - Host: @
   - Value: v=spf1 include:_spf.mailerlite.com ~all
   - TTL: 3600

6. TXT Record (DMARC)
   - Type: TXT
   - Host: _dmarc
   - Value: v=DMARC1; p=none; rua=mailto:dmarc@mailerlite.com
   - TTL: 3600
```

**⚠️ CRITICAL:**

- DNS changes take 24-48 hours to fully propagate
- Some changes may work in 1-2 hours
- Don't panic if things don't work immediately

**✅ Checkpoint:** All DNS records added to punto.pe

---

## 🔧 **STEP 5: UPDATE BACKEND ON RENDER**

### **5.1 Update Environment Variables**

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your backend service: `oregonchem-backend`
3. Go to **Environment** tab
4. Update these variables:

| Variable        | Current Value   | New Value                       |
| --------------- | --------------- | ------------------------------- |
| `SMTP_PORT`     | `587`           | `2525`                          |
| `SMTP_FROM`     | (check current) | `noreply@quimicaindustrial.pe`  |
| `COMPANY_EMAIL` | (check current) | `contacto@quimicaindustrial.pe` |

**Other SMTP Variables (verify they're set):**

- `SMTP_HOST` = `smtp.mailerlite.com`
- `SMTP_USER` = `apikey`
- `SMTP_PASS` = `[Your MailerLite API token]`
- `SMTP_SECURE` = `false`

### **5.2 Add CORS for New Domain**

The backend already has CORS configured, but verify these origins are allowed:

```javascript
// Should already be in app.js
'https://quimicaindustrialpe.com',
'https://www.quimicaindustrialpe.com',
'https://quimicaindustrial.pe',
'https://www.quimicaindustrial.pe',
```

**✅ Checkpoint:** Backend configured for production email sending

---

## ✅ **STEP 6: VERIFY DOMAIN IN MAILERLITE**

### **6.1 Wait for DNS Propagation**

After adding DNS records to punto.pe:

- Wait at least 2-4 hours
- Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net)
- Search for: `quimicaindustrial.pe`
- Look for TXT and CNAME records

### **6.2 Verify Domain in MailerLite**

1. Go back to MailerLite → **Settings** → **Domains**
2. Find `quimicaindustrial.pe`
3. Click **"Verify"** or **"Check DNS"**
4. If successful, you'll see: ✅ **Verified**

**If verification fails:**

- Wait longer (DNS can take up to 48 hours)
- Double-check DNS records in punto.pe
- Make sure there are no typos

**✅ Checkpoint:** Domain verified in MailerLite

---

## 🎯 **STEP 7: CONNECT CUSTOM DOMAIN IN VERCEL**

### **7.1 Add Custom Domain**

1. In Vercel project → **Settings** → **Domains**
2. Click **"Add"**
3. Enter: `www.quimicaindustrial.pe`
4. Click **"Add"**
5. Repeat for: `quimicaindustrial.pe` (without www)

### **7.2 Verify DNS Configuration**

Vercel will automatically check if DNS is configured correctly.

**Status indicators:**

- 🟡 **Pending**: DNS not propagated yet (wait)
- ✅ **Valid**: Domain is working!
- ❌ **Invalid**: Check DNS records

### **7.3 Set Primary Domain**

1. In Vercel Domains list
2. Find `www.quimicaindustrial.pe`
3. Click **"..."** menu
4. Select **"Set as Primary"**

This makes `www.quimicaindustrial.pe` the main domain, and `quimicaindustrial.pe` will redirect to it.

**✅ Checkpoint:** Custom domain connected to Vercel

---

## 🧪 **STEP 8: TESTING**

### **8.1 Test Website**

Visit: `https://www.quimicaindustrial.pe`

**Check:**

- [ ] Homepage loads
- [ ] Categories display
- [ ] Products load
- [ ] Banner carousel works (if multiple banners)
- [ ] Search works
- [ ] Product pages load
- [ ] Cart works
- [ ] Quote form loads

### **8.2 Test Quote Form**

1. Go to: `https://www.quimicaindustrial.pe/cotizacion`
2. Fill out the form with a test email
3. Submit the quote
4. Check:
   - [ ] Success message appears
   - [ ] Quote saved to MongoDB (check backend logs)
   - [ ] Email received at company email (`contacto@quimicaindustrial.pe`)
   - [ ] Confirmation email received at customer email

**Check Render Logs:**

```
1. Go to Render Dashboard
2. Select oregonchem-backend
3. Click "Logs" tab
4. Look for "Email sent successfully" or errors
```

### **8.3 Test Email Delivery**

**If emails don't arrive:**

1. Check Render logs for SMTP errors
2. Verify MailerLite domain is verified
3. Check spam folder
4. Wait 5-10 minutes (email can be delayed)
5. Try with different email addresses

**✅ Checkpoint:** Everything works on production!

---

## 📊 **STEP 9: MONITORING & MAINTENANCE**

### **9.1 Monitor Quote Submissions**

**Backend Logs (Render):**

- Go to Render Dashboard → oregonchem-backend → Logs
- Watch for quote submissions and email sending

**MongoDB:**

- Quotes are stored in the `quotes` collection
- Check MongoDB Atlas dashboard

### **9.2 Monitor Email Delivery**

**MailerLite Dashboard:**

- Go to MailerLite → **Reports**
- Check email delivery rates
- Monitor bounces and spam reports

### **9.3 Update Banners**

1. Go to Dashboard: `http://localhost:10001` (or deployed dashboard)
2. Navigate to Banners → Create Banner
3. Upload images to Firebase Storage
4. Set placement to "homepage-hero"
5. Set sortOrder to control sequence
6. Make active
7. Banners will appear on homepage carousel

---

## 🚨 **TROUBLESHOOTING**

### **Problem: Site not loading**

**Solution:**

- Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net)
- Wait 24-48 hours for DNS
- Verify Vercel domain status
- Check Vercel deployment logs

### **Problem: Emails not sending**

**Solution:**

- Check Render environment variables
- Verify MailerLite domain is verified
- Check Render logs for SMTP errors
- Try port 2525 instead of 587
- Verify SMTP credentials

### **Problem: Categories/Products not loading**

**Solution:**

- Check browser console for API errors
- Verify `PUBLIC_QI_API_URL` in Vercel environment variables
- Check backend is running on Render
- Verify MongoDB connection

### **Problem: Images not displaying**

**Solution:**

- Check Firebase Storage rules (allow public read)
- Verify image URLs are correct
- Check CORS settings in Firebase

---

## 📝 **FINAL CHECKLIST**

Before going live, verify:

### **Frontend (Vercel)**

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variable `PUBLIC_QI_API_URL` set
- [ ] Custom domain added (`www.quimicaindustrial.pe`)
- [ ] SSL certificate active (automatic)

### **Backend (Render)**

- [ ] SMTP settings updated (port 2525)
- [ ] Email addresses updated (`contacto@quimicaindustrial.pe`)
- [ ] CORS includes new domain
- [ ] Service is running

### **DNS (punto.pe)**

- [ ] A record for `@` pointing to Vercel
- [ ] CNAME for `www` pointing to Vercel
- [ ] TXT record for MailerLite verification
- [ ] CNAME for MailerLite DKIM
- [ ] TXT for SPF
- [ ] TXT for DMARC
- [ ] DNS propagated (check whatsmydns.net)

### **Email (MailerLite)**

- [ ] Domain added
- [ ] DNS records configured
- [ ] Domain verified
- [ ] Test email sent successfully

### **Testing**

- [ ] Website loads on custom domain
- [ ] Quote form works
- [ ] Emails are received
- [ ] Banner carousel works
- [ ] Products display correctly
- [ ] Cart functionality works

---

## 🎉 **YOU'RE LIVE!**

Once all checkboxes are complete, your site is live at:
**https://www.quimicaindustrial.pe**

---

## 📞 **SUPPORT CONTACTS**

- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **Render Support:** [render.com/support](https://render.com/support)
- **MailerLite Support:** [mailerlite.com/help](https://www.mailerlite.com/help)
- **punto.pe Support:** [punto.pe/contacto](https://www.punto.pe/contacto)

---

## 📚 **ADDITIONAL RESOURCES**

- [Vercel Documentation](https://vercel.com/docs)
- [Astro Documentation](https://docs.astro.build)
- [MailerLite SMTP Guide](https://www.mailerlite.com/help/how-to-use-smtp)
- [DNS Propagation Checker](https://www.whatsmydns.net)

---

**Last Updated:** December 10, 2024  
**Version:** 1.0  
**Status:** Production Ready ✅
