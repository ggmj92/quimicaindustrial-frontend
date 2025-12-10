# ✅ DEPLOYMENT MASTER CHECKLIST

## 🎯 Complete this checklist in order. Check off each item as you complete it.

---

## **PHASE 1: PREPARATION** (10 minutes)

### Frontend Code

- [ ] Frontend `.env` updated to production backend URL
- [ ] All changes committed to Git
- [ ] Code pushed to GitHub
  ```bash
  cd /Users/ggmj/Development/quimicaindustrial-frontend
  git add .
  git commit -m "Production ready: Quote form, banners, Firebase Storage"
  git push origin main
  ```

### Accounts Ready

- [ ] Vercel account logged in
- [ ] Render account logged in
- [ ] MailerLite account logged in
- [ ] punto.pe account logged in

---

## **PHASE 2: VERCEL DEPLOYMENT** (5 minutes)

- [ ] Go to https://vercel.com/dashboard
- [ ] Click "Add New Project"
- [ ] Import `quimicaindustrial-frontend` from GitHub
- [ ] Framework detected as "Astro" ✅
- [ ] Add environment variable:
  - Name: `PUBLIC_QI_API_URL`
  - Value: `https://oregonchem-backend.onrender.com/api/qi`
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete (~2-3 minutes)
- [ ] Deployment successful ✅
- [ ] Note temporary URL: `_______________________________`

### Get Vercel DNS Records

- [ ] Go to Settings → Domains
- [ ] Click "Add Domain"
- [ ] Enter: `www.quimicaindustrial.pe`
- [ ] Vercel shows DNS records
- [ ] **COPY A record IP address:** `_______________________________`
- [ ] **COPY CNAME value:** (should be `cname.vercel-dns.com`)

---

## **PHASE 3: DNS CONFIGURATION** (10 minutes)

### Add Records to punto.pe

Go to: https://www.punto.pe → My Domains → quimicaindustrial.pe → DNS

#### Record 1: CNAME (MailerLite DKIM)

- [ ] Type: `CNAME`
- [ ] Host: `litesrv._domainkey`
- [ ] Value: `litesrv._domainkey.mlsend.com`
- [ ] TTL: `3600`
- [ ] **SAVED** ✅

#### Record 2: TXT (MailerLite SPF)

- [ ] Type: `TXT`
- [ ] Host: `@`
- [ ] Value: `v=spf1 include:_spf.mlsend.com +a +mx +ip4:162.240.147.51 ~all`
- [ ] TTL: `3600`
- [ ] **SAVED** ✅

#### Record 3: TXT (MailerLite Verification)

- [ ] Type: `TXT`
- [ ] Host: `@`
- [ ] Value: `mailerlite-domain-verification=f3e89e5fae0b9b7de7bdda0096fca68dbe3f7358`
- [ ] TTL: `3600`
- [ ] **SAVED** ✅

#### Record 4: A (Vercel Root)

- [ ] Type: `A`
- [ ] Host: `@`
- [ ] Value: `[IP from Vercel - see Phase 2]`
- [ ] TTL: `3600`
- [ ] **SAVED** ✅

#### Record 5: CNAME (Vercel WWW)

- [ ] Type: `CNAME`
- [ ] Host: `www`
- [ ] Value: `cname.vercel-dns.com`
- [ ] TTL: `3600`
- [ ] **SAVED** ✅

### Verify All Records Added

- [ ] Total of 5 DNS records added to punto.pe
- [ ] Screenshot taken for reference (optional)

---

## **PHASE 4: RENDER BACKEND UPDATE** (5 minutes)

Go to: https://dashboard.render.com → `oregonchem-backend` → Environment

### Update Variables

- [ ] `SMTP_PORT` = `2525` (changed from 587)
- [ ] `SMTP_HOST` = `smtp.mailerlite.com` (verified)
- [ ] `SMTP_USER` = `apikey` (verified)
- [ ] `SMTP_PASS` = [JWT token exists] (verified)
- [ ] `SMTP_SECURE` = `false` (verified)
- [ ] `SMTP_FROM` = `noreply@quimicaindustrial.pe` (updated)
- [ ] `COMPANY_EMAIL` = `contacto@quimicaindustrial.pe` (updated)
- [ ] Click "Save Changes"
- [ ] Render redeploys automatically
- [ ] Redeploy completed successfully ✅
- [ ] Check logs: "Server running on port 10000" ✅

---

## **PHASE 5: WAITING PERIOD** (2-4 hours)

### DNS Propagation

- [ ] Started waiting at: **\*\***\_**\*\*** (time)
- [ ] Check DNS propagation: https://www.whatsmydns.net
  - Search: `quimicaindustrial.pe` (A record)
  - Search: `www.quimicaindustrial.pe` (CNAME)
  - Search: `litesrv._domainkey.quimicaindustrial.pe` (CNAME)
- [ ] DNS propagated globally ✅

**⏱️ Typical wait time: 2-4 hours (can be up to 48 hours)**

---

## **PHASE 6: DOMAIN VERIFICATION** (5 minutes)

### MailerLite

- [ ] Go to https://dashboard.mailerlite.com
- [ ] Settings → Domains
- [ ] Find `quimicaindustrial.pe`
- [ ] Click "Verify" or "Check DNS"
- [ ] Status shows: ✅ **Verified**

### Vercel

- [ ] Go to Vercel → Project → Settings → Domains
- [ ] Domain `www.quimicaindustrial.pe` status: ✅ **Valid**
- [ ] Domain `quimicaindustrial.pe` status: ✅ **Valid**
- [ ] Set `www.quimicaindustrial.pe` as primary domain

---

## **PHASE 7: TESTING** (15 minutes)

### Website Loading

- [ ] Visit: `https://www.quimicaindustrial.pe`
- [ ] Homepage loads correctly ✅
- [ ] SSL certificate active (🔒 in browser) ✅
- [ ] No console errors ✅

### Navigation

- [ ] Header navigation works
- [ ] Footer links work
- [ ] Categories page loads: `/categorias`
- [ ] Products page loads: `/productos`
- [ ] Quote page loads: `/cotizacion`

### Product Catalog

- [ ] Products display on homepage
- [ ] Categories display correctly
- [ ] Search functionality works
- [ ] Product detail pages load
- [ ] Images load correctly

### Banner Carousel

- [ ] Banner displays on homepage
- [ ] If multiple banners: carousel rotates
- [ ] Navigation buttons work (if multiple)
- [ ] Auto-advance works (every 5 seconds)

### Shopping Cart

- [ ] Can add products to cart
- [ ] Cart count updates
- [ ] Cart modal opens
- [ ] Can remove items
- [ ] Can update quantities
- [ ] "Request Quote" button works

### Quote Form

- [ ] Form loads at `/cotizacion`
- [ ] All fields present
- [ ] Validation works
- [ ] Can select products from cart
- [ ] Can add product details (presentation, quantity, frequency)

---

## **PHASE 8: EMAIL TESTING** (10 minutes)

### Test Quote Submission

- [ ] Fill out quote form with test data
- [ ] Use your personal email: `_______________________________`
- [ ] Submit form
- [ ] Success message appears ✅
- [ ] No console errors ✅

### Check Company Email

- [ ] Email received at: `contacto@quimicaindustrial.pe`
- [ ] Email contains quote details
- [ ] PDF attachment present
- [ ] All product information correct
- [ ] Customer information correct

### Check Customer Email

- [ ] Confirmation email received at test email
- [ ] Email looks professional
- [ ] PDF attachment present
- [ ] Company information correct

### Check Render Logs

- [ ] Go to Render → oregonchem-backend → Logs
- [ ] Look for: "Quote created successfully"
- [ ] Look for: "Email sent successfully"
- [ ] No SMTP errors ✅

### Check MongoDB

- [ ] Quote saved to database
- [ ] All fields populated correctly
- [ ] Status is "pending"

---

## **PHASE 9: FINAL VERIFICATION** (5 minutes)

### Performance

- [ ] Page load time < 3 seconds
- [ ] Images load quickly
- [ ] No broken links
- [ ] Mobile responsive

### SEO

- [ ] Page titles correct
- [ ] Meta descriptions present
- [ ] Canonical URLs set
- [ ] Sitemap accessible (if applicable)

### Analytics (Optional)

- [ ] Google Analytics tracking (if set up)
- [ ] Facebook Pixel (if set up)

---

## **PHASE 10: GO LIVE** 🎉

### Announcement

- [ ] Update social media (if applicable)
- [ ] Notify team
- [ ] Update business cards/marketing materials

### Monitoring

- [ ] Set up uptime monitoring (optional)
- [ ] Set up error tracking (optional)
- [ ] Monitor Render logs for first 24 hours
- [ ] Monitor MailerLite delivery rates

### Documentation

- [ ] Save all credentials securely
- [ ] Document any custom configurations
- [ ] Keep deployment guides for reference

---

## **POST-LAUNCH CHECKLIST** (Ongoing)

### Daily (First Week)

- [ ] Check Render logs for errors
- [ ] Check MailerLite delivery rates
- [ ] Monitor quote submissions
- [ ] Respond to customer emails

### Weekly

- [ ] Review quote submissions
- [ ] Check website performance
- [ ] Update products/banners as needed
- [ ] Backup MongoDB data

### Monthly

- [ ] Review analytics
- [ ] Update content
- [ ] Check for security updates
- [ ] Review email templates

---

## 🚨 **ROLLBACK PLAN** (If Something Goes Wrong)

### If Website Doesn't Load:

1. Check Vercel deployment status
2. Check DNS propagation
3. Revert DNS to old settings if needed
4. Contact Vercel support

### If Emails Don't Send:

1. Check Render logs for errors
2. Verify MailerLite domain verification
3. Check SMTP credentials
4. Test with different email addresses

### If Products Don't Load:

1. Check browser console for errors
2. Verify backend is running on Render
3. Check MongoDB connection
4. Verify API URL in Vercel environment variables

---

## 📞 **EMERGENCY CONTACTS**

- **Vercel Support:** https://vercel.com/support
- **Render Support:** https://render.com/support
- **MailerLite Support:** https://www.mailerlite.com/help
- **punto.pe Support:** https://www.punto.pe/contacto
- **DNS Checker:** https://www.whatsmydns.net
- **SSL Checker:** https://www.ssllabs.com/ssltest/

---

## ✅ **COMPLETION**

- [ ] **ALL PHASES COMPLETED**
- [ ] **WEBSITE LIVE AT:** https://www.quimicaindustrial.pe
- [ ] **EMAILS WORKING:** ✅
- [ ] **QUOTE FORM WORKING:** ✅
- [ ] **EVERYTHING TESTED:** ✅

**Deployment Date:** **\*\***\_\_\_**\*\***  
**Deployed By:** **\*\***\_\_\_**\*\***  
**Time Taken:** **\*\***\_\_\_**\*\***

---

## 🎉 **CONGRATULATIONS!**

Your website is now live and fully functional!

**Next Steps:**

1. Monitor for the first 24-48 hours
2. Respond to any customer inquiries
3. Update products and banners as needed
4. Enjoy your new website! 🚀

---

**Last Updated:** December 10, 2024  
**Version:** 1.0  
**Status:** Ready for Deployment ✅
