// src/pages/api/submit-payment.ts
// ─────────────────────────────────────────────────────────────
// Server-side endpoint that ACTUALLY sends the payment-proof
// submission email — including the uploaded screenshot as a real
// file attachment. Called via fetch() from submit-payment.astro's
// form, replacing the old mailto: approach (which only opened the
// customer's own email app and never guaranteed anything was sent,
// and never attached the screenshot at all — mailto: links cannot
// carry file attachments).
//
// `export const prerender = false` opts this route out of Astro's
// static build so it runs as a real server function per request.
//
// Uses the SAME SMTP_* env vars as /api/send-inquiry.ts — one set
// of credentials, reused for every email the site sends. See
// .env.example for setup (Gmail App Password or any custom SMTP).
// ─────────────────────────────────────────────────────────────

export const prerender = false;

import type { APIRoute } from 'astro';
import 'dotenv/config';
import nodemailer from 'nodemailer';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB, matches the form's stated limit
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();

    const fullName     = (formData.get('fullName') ?? '').toString().trim();
    const customerEmail= (formData.get('email') ?? '').toString().trim();
    const templateName = (formData.get('templateName') ?? '').toString().trim();
    const paymentMethod= (formData.get('paymentMethod') ?? '').toString().trim();
    const amount       = (formData.get('amount') ?? '').toString().trim();
    const message       = (formData.get('message') ?? '').toString().trim();
    const screenshot    = formData.get('screenshot');

    // ── Validation — mirrors the client-side checks already in
    //    submit-payment.astro, so a request that somehow bypasses
    //    those (JS disabled, tampered request) still gets rejected
    //    server-side rather than silently emailing incomplete data. ──
    if (!fullName || !customerEmail || !templateName || !paymentMethod || !amount) {
      return json({ success: false, error: 'Missing required fields.' }, 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return json({ success: false, error: 'That email address doesn\u2019t look valid.' }, 400);
    }

    if (!(screenshot instanceof File) || screenshot.size === 0) {
      return json({ success: false, error: 'Please attach your payment screenshot.' }, 400);
    }

    if (screenshot.size > MAX_FILE_SIZE) {
      return json({ success: false, error: 'Screenshot is too large (max 10 MB).' }, 400);
    }

    if (!ALLOWED_TYPES.includes(screenshot.type)) {
      return json({ success: false, error: 'Screenshot must be a PNG, JPG, or WEBP image.' }, 400);
    }

    const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
    const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
    const SMTP_USER = process.env.SMTP_USER;
    const SMTP_PASS = process.env.SMTP_PASS;
    const INQUIRY_TO_EMAIL = process.env.INQUIRY_TO_EMAIL || SMTP_USER;

    if (!SMTP_USER || !SMTP_PASS) {
      console.error('submit-payment: SMTP_USER / SMTP_PASS are not set.');
      return json({ success: false, error: 'Email is not configured on the server yet.' }, 500);
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const screenshotBuffer = Buffer.from(await screenshot.arrayBuffer());

    await transporter.sendMail({
      from: `"Template Depot Website" <${SMTP_USER}>`,
      to: INQUIRY_TO_EMAIL,
      replyTo: customerEmail,
      subject: `[Template Depot Order] ${templateName} \u2014 ${fullName}`,
      text:
        `New payment proof submission from the website:\n\n` +
        `Full Name: ${fullName}\n` +
        `Email: ${customerEmail}\n` +
        `Template(s) Ordered: ${templateName}\n` +
        `Payment Method: ${paymentMethod}\n` +
        `Amount Paid: \u20B1${amount}\n\n` +
        `Message:\n${message || 'None'}\n\n` +
        `Payment screenshot is attached to this email.`,
      html:
        `<p>New payment proof submission from the website:</p>` +
        `<p>` +
        `<strong>Full Name:</strong> ${escapeHtml(fullName)}<br/>` +
        `<strong>Email:</strong> ${escapeHtml(customerEmail)}<br/>` +
        `<strong>Template(s) Ordered:</strong> ${escapeHtml(templateName)}<br/>` +
        `<strong>Payment Method:</strong> ${escapeHtml(paymentMethod)}<br/>` +
        `<strong>Amount Paid:</strong> \u20B1${escapeHtml(amount)}` +
        `</p>` +
        (message ? `<p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>` : '') +
        `<p>Payment screenshot is attached to this email.</p>`,
      attachments: [
        {
          filename: screenshot.name || 'payment-screenshot.jpg',
          content: screenshotBuffer,
          contentType: screenshot.type,
        },
      ],
    });

    return json({ success: true }, 200);
  } catch (err) {
    console.error('submit-payment: failed to send email', err);
    return json({ success: false, error: 'Failed to send your payment proof. Please try again.' }, 500);
  }
};

function json(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
