# 🌐 DNS Records for punto.pe - EXACT VALUES TO ADD

## ⚠️ ADD THESE RECORDS TO PUNTO.PE

---

## 📧 **MAILERLITE RECORDS** (Add these first)

### **Record 1: CNAME (DKIM)**

```
Type: CNAME
Name/Host: litesrv._domainkey
Value/Points To: litesrv._domainkey.mlsend.com
TTL: 3600
```

### **Record 2: TXT (SPF)**

```
Type: TXT
Name/Host: @
Value: v=spf1 include:_spf.mlsend.com +a +mx +ip4:162.240.147.51 ~all
TTL: 3600
```

### **Record 3: TXT (Domain Verification)**

```
Type: TXT
Name/Host: @
Value: mailerlite-domain-verification=f3e89e5fae0b9b7de7bdda0096fca68dbe3f7358
TTL: 3600
```

---

## 🌐 **VERCEL RECORDS** (Get these from Vercel)

### **Step 1: Get Vercel DNS Records**

1. Go to Vercel Dashboard
2. Select your project: `quimicaindustrial-frontend`
3. Go to **Settings** → **Domains**
4. Click **"Add Domain"**
5. Enter: `www.quimicaindustrial.pe`
6. Vercel will show you DNS records

### **Record 4: A Record (Root Domain)**

```
Type: A
Name/Host: @
Value/Points To: [Vercel will give you an IP like 76.76.21.21]
TTL: 3600
```

### **Record 5: CNAME (WWW Subdomain)**

```
Type: CNAME
Name/Host: www
Value/Points To: cname.vercel-dns.com
TTL: 3600
```

---

## 📝 **HOW TO ADD IN PUNTO.PE**

Based on your punto.pe screenshot, here's how to add each record:

### **For CNAME Records:**

1. Click **"Add Record"** or similar button
2. Select **Type**: `CNAME`
3. Enter **Name/Host**: (e.g., `litesrv._domainkey` or `www`)
4. Enter **Value**: (e.g., `litesrv._domainkey.mlsend.com`)
5. Enter **TTL**: `3600` (or leave default)
6. Save

### **For TXT Records:**

1. Click **"Add Record"**
2. Select **Type**: `TXT`
3. Enter **Name/Host**: `@` (this means root domain)
4. Enter **Value**: (copy the entire value exactly)
5. Enter **TTL**: `3600` (or leave default)
6. Save

### **For A Records:**

1. Click **"Add Record"**
2. Select **Type**: `A`
3. Enter **Name/Host**: `@`
4. Enter **Value**: (IP address from Vercel)
5. Enter **TTL**: `3600` (or leave default)
6. Save

---

## ⚠️ **IMPORTANT NOTES**

### **About the @ Symbol:**

- `@` means the root domain: `quimicaindustrial.pe`
- Some DNS providers show it as blank or as `@`
- Both are correct

### **About Multiple TXT Records:**

- You're adding **TWO** TXT records for `@`:
  1. SPF record (starts with `v=spf1`)
  2. Verification record (starts with `mailerlite-domain-verification`)
- This is normal! You can have multiple TXT records for the same host
- punto.pe should allow this

### **Copy-Paste Carefully:**

- Copy the ENTIRE value
- Don't add quotes unless punto.pe adds them automatically
- Don't add spaces at the beginning or end
- Don't add `http://` or `https://`

---

## ✅ **VERIFICATION CHECKLIST**

After adding all records, verify you have:

```
□ CNAME: litesrv._domainkey → litesrv._domainkey.mlsend.com
□ TXT: @ → v=spf1 include:_spf.mlsend.com +a +mx +ip4:162.240.147.51 ~all
□ TXT: @ → mailerlite-domain-verification=f3e89e5fae0b9b7de7bdda0096fca68dbe3f7358
□ A: @ → [Vercel IP]
□ CNAME: www → cname.vercel-dns.com
```

**Total: 5 DNS records**

---

## ⏱️ **AFTER ADDING RECORDS**

### **1. Wait for DNS Propagation (2-4 hours)**

Check progress at: https://www.whatsmydns.net

**Search for:**

- `quimicaindustrial.pe` (A record)
- `www.quimicaindustrial.pe` (CNAME)
- `litesrv._domainkey.quimicaindustrial.pe` (CNAME)

### **2. Verify in MailerLite**

1. Go to MailerLite → Settings → Domains
2. Find `quimicaindustrial.pe`
3. Click **"Verify"** or **"Check DNS"**
4. Should show: ✅ **Verified**

### **3. Verify in Vercel**

1. Go to Vercel → Your Project → Settings → Domains
2. Domain status should change from 🟡 Pending to ✅ Valid

---

## 🚨 **TROUBLESHOOTING**

### **"Record already exists" error:**

- You might have old DNS records
- Delete the old record first
- Then add the new one

### **Can't add multiple TXT records for @:**

- Some DNS providers combine them automatically
- Try adding them one at a time
- Contact punto.pe support if needed

### **DNS not propagating:**

- Wait longer (can take up to 48 hours)
- Clear your browser cache
- Try incognito mode
- Check from different device/network

---

## 📞 **NEED HELP?**

- **punto.pe Support:** https://www.punto.pe/contacto
- **DNS Checker:** https://www.whatsmydns.net
- **DNS Lookup Tool:** https://mxtoolbox.com/SuperTool.aspx

---

## 🎯 **NEXT STEPS AFTER DNS IS CONFIGURED**

1. ✅ Add all 5 DNS records to punto.pe
2. ⏱️ Wait 2-4 hours for propagation
3. ✅ Verify domain in MailerLite
4. ✅ Verify domain in Vercel
5. 🧪 Test the website
6. 📧 Test quote form and emails
7. 🎉 Go live!

---

**Last Updated:** December 10, 2024  
**Status:** Ready to add to punto.pe ✅
