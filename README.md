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

## 🚀 Deploying to Hostinger

This project includes a server-side payment-proof endpoint that sends uploaded
screenshots by email. It therefore requires a Hostinger plan with **Node.js
application hosting**. A static-only hosting plan cannot run
`/api/submit-payment`.

1. In Hostinger hPanel, create a Node.js application for `templatedepot.shop`.
2. Use Node.js 20, the production environment, and the repository as the source.
3. Set the application start file to `dist/server/entry.mjs`.
4. Set the build command to `npm run build` and the start command to
   `node dist/server/entry.mjs`.
5. Add the variables from `.env.example` in hPanel's environment-variable
   settings. Do not upload `.env` or commit SMTP credentials.
6. Point the domain's DNS to the Node.js application as instructed by
   Hostinger, then enable HTTPS.
7. After deployment, test both the home page and a payment-proof submission
   with a real image attachment.

The production build outputs a standalone Node server in `dist/server`:

```bash
npm install
npm run build
node dist/server/entry.mjs
```

### Alternative: static-only Hostinger hosting

Static hosting can serve the catalog pages, but it cannot process payment
proofs or send email. To use a static-only plan, the payment-proof workflow
must be moved to an external form/email service before deployment; do not
deploy the current API-less version expecting `/api/submit-payment` to work.

## ☁️ Deploying to Cloudflare Pages (legacy option)

### Option 1: Via Cloudflare Dashboard (Recommended)

1. Push your project to a GitHub repository.
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com).
3. Go to **Workers & Pages** → **Create Application** → **Pages**.
4. Click **Connect to Git** and select your repository.
5. Configure the build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Node.js version:** 20
6. Click **Save and Deploy**.

### Option 2: Via Wrangler CLI

```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=template-depot
```

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
- [x] Set `site` in `astro.config.mjs` to `https://templatedepot.shop`
- [ ] Add a real `og-image.png` (1200×630px) to the `/public` folder

### Hosting & email
- [ ] Confirm the Hostinger plan supports Node.js applications
- [ ] Configure all five SMTP variables from `.env.example` in Hostinger
- [ ] Verify the SMTP provider permits the selected host/port and sender
- [ ] Submit a real test payment proof and confirm the attachment arrives
- [ ] Configure backups, domain HTTPS, and an error/log monitoring process

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
