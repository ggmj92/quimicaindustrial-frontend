# Deployment Guide: Química Industrial Perú

## Complete Setup with MailerLite + Vercel + punto.pe

### 1. MailerLite SMTP Setup

#### Get SMTP Credentials

1. Log into your **MailerLite** account
2. Go to **Settings** → **Integrations** → **SMTP**
3. Note your SMTP credentials:
   - Host: `smtp.mailerlite.com`
   - Port: `587`
   - Username: Your MailerLite SMTP username
   - Password: Your MailerLite SMTP password

#### Verify Sender Domain

1. In MailerLite, go to **Settings** → **Domains**
2. Add and verify `quimicaindustrial.pe`
3. Add DNS records to punto.pe (see DNS section below)

---

### 2. Backend Deployment (Vercel)

#### Prepare Backend

1. Navigate to backend directory:

   ```bash
   cd /Users/ggmj/Development/OregonChemDigital/oregonchem_backend
   ```

2. Update `.env` with MailerLite credentials:

   ```env
   # MailerLite SMTP
   SMTP_HOST=smtp.mailerlite.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_mailerlite_smtp_username
   SMTP_PASS=your_mailerlite_smtp_password
   SMTP_FROM=noreply@quimicaindustrial.pe

   # Company Info
   COMPANY_EMAIL=contacto@quimicaindustrial.pe
   ```

3. Deploy to Vercel:

   ```bash
   vercel --prod
   ```

4. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Add all `.env` variables
   - Redeploy

#### Note Your Backend URL

After deployment, note your backend URL (e.g., `https://oregonchem-backend.vercel.app`)

---

### 3. Frontend Deployment (Vercel)

#### Update API Endpoint

1. Navigate to frontend directory:

   ```bash
   cd /Users/ggmj/Development/quimicaindustrial-frontend
   ```

2. Update the API endpoint in `/src/pages/cotizacion.astro`:

   ```javascript
   // Change from:
   const response = await fetch('http://localhost:3000/api/qi/quotes', {

   // To:
   const response = await fetch('https://your-backend-url.vercel.app/api/qi/quotes', {
   ```

3. Or better, use environment variable:

   ```javascript
   const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';
   const response = await fetch(`${API_URL}/api/qi/quotes`, {
   ```

4. Create `.env`:
   ```env
   PUBLIC_API_URL=https://your-backend-url.vercel.app
   ```

#### Deploy Frontend

```bash
vercel --prod
```

---

### 4. DNS Configuration (punto.pe)

Log into punto.pe and configure DNS records:

#### A. Point Domain to Vercel

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

```
Type: A
Name: @
Value: 76.76.21.21 (Vercel's IP)
TTL: 3600
```

#### B. Email Records (Keep Existing or Add New)

**MX Records** (for receiving email):

```
Type: MX
Name: @
Value: smtp.mailerlite.com
Priority: 10
TTL: 3600
```

**SPF Record** (prevent spam):

```
Type: TXT
Name: @
Value: v=spf1 include:_spf.mailerlite.com ~all
TTL: 3600
```

**DKIM Record** (email authentication):

```
Type: TXT
Name: ml._domainkey
Value: [Get this from MailerLite domain verification]
TTL: 3600
```

**DMARC Record** (email policy):

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:contacto@quimicaindustrial.pe
TTL: 3600
```

---

### 5. Vercel Custom Domain Setup

1. In Vercel dashboard, go to your frontend project
2. Go to **Settings** → **Domains**
3. Add domain: `www.quimicaindustrial.pe`
4. Add domain: `quimicaindustrial.pe`
5. Vercel will provide DNS instructions
6. Wait for DNS propagation (can take up to 48 hours)

---

### 6. Email Template Customization

The backend sends two emails:

#### Company Email (to contacto@quimicaindustrial.pe)

- Includes full quote details
- Attached PDF with all information
- Template: `/src/templates/quimicaindustrialpe/company-notification.html`

#### Client Confirmation Email

- Thank you message
- Quote summary
- Contact information
- Template: `/src/templates/quimicaindustrialpe/client-confirmation.html`

**To customize templates:**

1. Edit HTML files in `/src/templates/quimicaindustrialpe/`
2. Use Handlebars syntax: `{{variableName}}`
3. Test locally before deploying

---

### 7. PDF Customization

The PDF quote includes:

- Company logo
- Client information
- Product list with quantities and frequencies
- Contact preferences
- Observations

**To customize PDF:**

1. Edit `/src/services/pdfService.js`
2. Update company info in `defaultSiteConfig`
3. Add your logo to `/public/qiLogo.png`
4. Adjust styling (colors, fonts, layout)

---

### 8. Testing Checklist

Before going live:

- [ ] Test quote form submission locally
- [ ] Verify emails arrive at contacto@quimicaindustrial.pe
- [ ] Check client confirmation email
- [ ] Verify PDF attachment is correct
- [ ] Test all client types (Natural, Empresa, Natural-Empresa)
- [ ] Test contact preferences
- [ ] Verify cart integration
- [ ] Test on mobile devices
- [ ] Check all form validations
- [ ] Test with real products

---

### 9. Monitoring & Maintenance

#### Check Email Delivery

- Monitor MailerLite dashboard for delivery rates
- Check spam folder if emails don't arrive
- Review bounce and complaint rates

#### Backend Logs

```bash
vercel logs [deployment-url]
```

#### Database

- Quotes are saved to MongoDB
- Access via dashboard or MongoDB Compass
- Collection: `quotes` in `quimicaindustrial` database

---

### 10. Troubleshooting

#### Emails Not Sending

1. Check SMTP credentials in Vercel environment variables
2. Verify domain is verified in MailerLite
3. Check DNS records are correct
4. Review backend logs for errors

#### CORS Errors

Add to backend `app.js`:

```javascript
app.use(
  cors({
    origin: [
      "https://www.quimicaindustrial.pe",
      "https://quimicaindustrial.pe",
    ],
    credentials: true,
  }),
);
```

#### PDF Not Generating

1. Check logo file exists at `/public/qiLogo.png`
2. Verify pdfkit is installed
3. Check backend logs for PDF generation errors

---

### 11. Going Live Checklist

- [ ] Backend deployed to Vercel with all env variables
- [ ] Frontend deployed to Vercel
- [ ] Custom domain configured in Vercel
- [ ] DNS records updated at punto.pe
- [ ] Domain verified in MailerLite
- [ ] Test email sent successfully
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Old WordPress site backed up
- [ ] Monitor first few quote submissions
- [ ] Update Google Analytics (if applicable)
- [ ] Update any external links to new site

---

## Support

For issues:

1. Check Vercel deployment logs
2. Check MailerLite delivery logs
3. Review MongoDB for saved quotes
4. Contact Vercel support for hosting issues
5. Contact MailerLite support for email issues

---

## Quick Commands

```bash
# Deploy backend
cd oregonchem_backend && vercel --prod

# Deploy frontend
cd quimicaindustrial-frontend && vercel --prod

# View backend logs
vercel logs [deployment-url]

# Test locally
npm run dev
```
