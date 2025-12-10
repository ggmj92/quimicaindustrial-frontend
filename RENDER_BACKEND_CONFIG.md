# 🔧 Render Backend Configuration

## Environment Variables to Update on Render

Go to: https://dashboard.render.com → `oregonchem-backend` → **Environment** tab

---

## 📧 **SMTP SETTINGS (MailerLite)**

Update or verify these variables:

```
SMTP_HOST=smtp.mailerlite.com
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=[Your MailerLite API Token - keep the existing one]
SMTP_FROM=noreply@quimicaindustrial.pe
COMPANY_EMAIL=contacto@quimicaindustrial.pe
COMPANY_NAME=Química Industrial Perú
```

---

## 🔍 **VERIFY THESE VARIABLES EXIST**

These should already be set, but double-check:

```
NODE_ENV=production
PORT=10000
MONGODB_URI_PROD=[Your MongoDB connection string]
FIREBASE_PROJECT_ID=oregonchem-pe
```

---

## 🌐 **CORS ORIGINS**

The backend code already includes these origins in `app.js`:

- `https://quimicaindustrial.pe`
- `https://www.quimicaindustrial.pe`
- `https://quimicaindustrialpe.com`
- `https://www.quimicaindustrialpe.com`

No changes needed here! ✅

---

## ⚙️ **HOW TO UPDATE ON RENDER**

1. Go to https://dashboard.render.com
2. Click on `oregonchem-backend` service
3. Click **"Environment"** tab in the left sidebar
4. Find each variable in the list
5. Click **"Edit"** (pencil icon)
6. Update the value
7. Click **"Save Changes"**
8. Render will automatically redeploy (takes ~2 minutes)

---

## 🧪 **TEST AFTER UPDATING**

After Render redeploys:

1. Check logs: Render Dashboard → oregonchem-backend → **Logs** tab
2. Look for: `Server running on port 10000`
3. Test API: https://oregonchem-backend.onrender.com/api/health
4. Should return: `{"status":"ok"}`

---

## 📝 **VARIABLES TO UPDATE**

| Variable        | Current Value | New Value                       | Action            |
| --------------- | ------------- | ------------------------------- | ----------------- |
| `SMTP_PORT`     | `587`         | `2525`                          | **UPDATE**        |
| `SMTP_FROM`     | (check)       | `noreply@quimicaindustrial.pe`  | **VERIFY/UPDATE** |
| `COMPANY_EMAIL` | (check)       | `contacto@quimicaindustrial.pe` | **VERIFY/UPDATE** |
| `SMTP_HOST`     | (check)       | `smtp.mailerlite.com`           | **VERIFY**        |
| `SMTP_USER`     | (check)       | `apikey`                        | **VERIFY**        |
| `SMTP_PASS`     | (exists)      | (keep existing)                 | **VERIFY EXISTS** |
| `SMTP_SECURE`   | (check)       | `false`                         | **VERIFY**        |

---

## ⚠️ **IMPORTANT NOTES**

### **About SMTP_PASS:**

- This is your MailerLite API token
- It's a long JWT token (starts with `eyJ0eXAiOiJKV1QiLCJhbGc...`)
- **Don't change this** unless you have a new token
- Keep it secret!

### **About SMTP_PORT:**

- **Change from 587 to 2525**
- Port 2525 works better on cloud platforms
- Port 587 often gets blocked

### **About Email Addresses:**

- `SMTP_FROM`: The "from" address in emails (noreply@quimicaindustrial.pe)
- `COMPANY_EMAIL`: Where quote notifications are sent (contacto@quimicaindustrial.pe)
- Both must use your verified domain

---

## ✅ **VERIFICATION CHECKLIST**

After updating:

```
□ SMTP_PORT = 2525
□ SMTP_HOST = smtp.mailerlite.com
□ SMTP_USER = apikey
□ SMTP_PASS = [long JWT token exists]
□ SMTP_SECURE = false
□ SMTP_FROM = noreply@quimicaindustrial.pe
□ COMPANY_EMAIL = contacto@quimicaindustrial.pe
□ Render service redeployed successfully
□ Logs show "Server running on port 10000"
□ Health check returns {"status":"ok"}
```

---

## 🚨 **TROUBLESHOOTING**

### **Render won't save changes:**

- Make sure you clicked "Save Changes"
- Wait for redeploy to complete
- Check for error messages

### **Service won't start after changes:**

- Check logs for errors
- Verify all required variables are set
- Make sure MONGODB_URI_PROD is correct

### **Emails still not sending:**

- Wait for DNS propagation (2-4 hours)
- Verify MailerLite domain is verified
- Check Render logs for SMTP errors
- Make sure SMTP_PASS is correct

---

## 📞 **SUPPORT**

- **Render Support:** https://render.com/support
- **Render Status:** https://status.render.com
- **Render Docs:** https://render.com/docs

---

**Last Updated:** December 10, 2024  
**Status:** Ready to update ✅
