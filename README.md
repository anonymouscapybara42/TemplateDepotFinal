# Template Depot — Deployment Guide

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Deploying to Hostinger Node.js

The payment submission endpoint sends email from the server, so this project
must run as a Node.js app rather than being uploaded as static files.

1. Create or select the Node.js web app in Hostinger hPanel and connect/upload
   this project.
2. Use a Node.js version supported by the app (Node 20 or later).
3. Install dependencies and build the app:

   ```bash
   npm install
   npm run build
   ```

4. Set the app's startup command to `npm start`. This runs
   `node ./dist/server/entry.mjs`.
5. Add these environment variables in the Hostinger app settings:
   - `SMTP_USER` and `SMTP_PASS` (required)
   - `SMTP_HOST` (optional; defaults to `smtp.gmail.com`)
   - `SMTP_PORT` (optional; defaults to `465`)
   - `INQUIRY_TO_EMAIL` (optional; defaults to `SMTP_USER`)
   - `SITE_ORIGIN` (optional; defaults to `https://templatedepot.shop`)
6. Restart/redeploy the app after saving the environment variables.

Do not deploy only the `dist/client` directory or upload this project as a
static site; that would omit the server endpoint used to submit payment proof.
The app validates state-changing request origins against `SITE_ORIGIN`, which
allows the public HTTPS origin to be checked when Hostinger terminates TLS
before the Node.js app.

---

## ✅ Pre-Launch Checklist

Before going live, update the following placeholders:

### Payment Information
- [ ] Replace "09XX XXX XXXX" GCash number with your real GCash number
- [ ] Replace "09XX XXX XXXX" Maya number with your real Maya number  
- [ ] Replace "Your Name Here" with your real account name
- [ ] Add your actual GCash QR code image to the PaymentSection component
- [ ] Add your actual Maya QR code image to the PaymentSection component

### Contact Information
- [ ] Update `hello@templatedepot.com` with your real business email
- [ ] Update Facebook page URL (`https://facebook.com/templatedepot`)
- [ ] Update Messenger URL (`https://m.me/61590735058749`)

### SEO & Meta
- [ ] Update `site` in `astro.config.mjs` with your real domain
- [ ] Add a real `og-image.png` (1200×630px) to the `/public` folder

### Content
- [ ] Review all template descriptions and pricing
- [ ] Update testimonials (or keep sample ones until you collect real ones)
- [ ] Update business hours in Contact and Footer if different

---

## 📁 Project Structure

```
template-depot/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.astro        ← Navigation with mobile menu
│   │   ├── Hero.astro          ← Hero section
│   │   ├── TemplateGrid.astro  ← Template cards with filtering
│   │   ├── Benefits.astro      ← Why choose us
│   │   ├── PurchaseProcess.astro ← 4-step process
│   │   ├── PaymentSection.astro  ← GCash/Maya QR codes
│   │   ├── Testimonials.astro  ← Customer reviews slider
│   │   ├── FAQ.astro           ← Accordion FAQ
│   │   ├── Contact.astro       ← Contact info
│   │   └── Footer.astro        ← Site footer
│   ├── layouts/
│   │   └── BaseLayout.astro    ← HTML wrapper + SEO
│   ├── pages/
│   │   └── index.astro         ← Main page
│   └── styles/
│       └── global.css          ← Global styles + Tailwind
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## 🎨 Design System

**Colors:**
- Navy 900: `#0A0F1E` (background)
- Indigo 500: `#6366F1` (primary)
- Cyan 400: `#22D3EE` (accent)
- Slate 400: `#94A3B8` (body text)

**Fonts:**
- Display: Space Grotesk (headings, labels, buttons)
- Body: Inter (paragraphs, descriptions)

---

## 🔧 Customization Tips

### Adding a New Template Card
Edit `src/components/TemplateGrid.astro` and add a new object to the `templates` array:

```typescript
{
  id: 9,
  title: 'Your Template Name',
  description: 'Short description here.',
  category: 'Business',         // Must match a filter button category
  price: '₱299',
  tag: 'New',                   // or '' for no tag
  tagColor: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
  gradient: 'from-cyan-600/30 to-teal-600/20',
  accent: 'bg-cyan-500',
  icon: '📋',
}
```

### Adding Real QR Images
Replace the QR placeholder divs in `PaymentSection.astro` with:

```html
<img src="/gcash-qr.png" alt="GCash QR Code" class="w-full rounded-xl" />
```

Place your QR image in the `/public` folder.
# TemplateDepot
