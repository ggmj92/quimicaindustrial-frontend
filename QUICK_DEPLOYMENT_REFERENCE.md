# ⚡ Quick Deployment Reference Card

## 🎯 **DEPLOYMENT ORDER**

```
1. MailerLite → Get DNS records
2. punto.pe → Add ALL DNS records (Vercel + MailerLite)
3. Vercel → Deploy frontend
4. Render → Update SMTP settings
5. Wait 2-4 hours for DNS
6. MailerLite → Verify domain
7. Vercel → Add custom domain
8. Test everything
```

---

## 📋 **DNS RECORDS FOR PUNTO.PE**

### **From Vercel** (Get from Vercel dashboard):

```
A      @      76.76.21.21 (or Vercel's IP)
CNAME  www    cname.vercel-dns.com
```

### **From MailerLite** (Get from MailerLite dashboard):

```
TXT    _mailerlite      [verification-code]
CNAME  ml._domainkey    ml._domainkey.mailerlite.com
TXT    @                v=spf1 include:_spf.mailerlite.com ~all
TXT    _dmarc           v=DMARC1; p=none; rua=mailto:dmarc@mailerlite.com
```

**⚠️ Use EXACT values from your dashboards, not these examples!**

---

## 🔧 **RENDER ENVIRONMENT VARIABLES**

Update these on Render:

```
SMTP_HOST=smtp.mailerlite.com
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=[Your MailerLite API token]
SMTP_FROM=noreply@quimicaindustrial.pe
COMPANY_EMAIL=contacto@quimicaindustrial.pe
```

---

## 🌐 **VERCEL ENVIRONMENT VARIABLES**

Add in Vercel project settings:

```
PUBLIC_QI_API_URL=https://oregonchem-backend.onrender.com/api/qi
```

---

## ✅ **TESTING CHECKLIST**

After deployment:

```
□ Visit https://www.quimicaindustrial.pe
□ Homepage loads
□ Products display
□ Banner carousel works
□ Quote form submits
□ Email received at contacto@quimicaindustrial.pe
□ Customer confirmation email received
```

---

## 🚨 **IF SOMETHING BREAKS**

### **Site not loading:**

- Check DNS: https://www.whatsmydns.net
- Wait 24-48 hours for DNS propagation
- Check Vercel deployment logs

### **Emails not sending:**

- Check Render logs for errors
- Verify MailerLite domain is verified (green checkmark)
- Check spam folder
- Wait 5-10 minutes

### **Products not loading:**

- Check browser console for errors
- Verify Vercel environment variable is set
- Check Render backend is running

---

## 📞 **QUICK LINKS**

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Render Dashboard:** https://dashboard.render.com
- **MailerLite Dashboard:** https://dashboard.mailerlite.com
- **punto.pe:** https://www.punto.pe
- **DNS Checker:** https://www.whatsmydns.net
- **Frontend Repo:** (your GitHub repo)
- **Backend Repo:** (your GitHub repo)

---

## 🎯 **DEPLOYMENT COMMANDS**

```bash
# Commit and push frontend
cd /Users/ggmj/Development/quimicaindustrial-frontend
git add .
git commit -m "Production ready"
git push origin main

# Then deploy on Vercel dashboard
```

---

## ⏱️ **TIMELINE**

- **Vercel Deployment:** 2-3 minutes
- **DNS Propagation:** 2-48 hours (usually 2-4 hours)
- **MailerLite Verification:** After DNS propagates
- **Total Time:** 2-48 hours from start to fully working

---

**Pro Tip:** Do all DNS changes at once, then wait. Don't keep changing them!
