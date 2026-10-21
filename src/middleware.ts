import { defineMiddleware } from 'astro:middleware';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const SITE_ORIGIN = new URL(process.env.SITE_ORIGIN || 'https://templatedepot.shop').origin;

export const onRequest = defineMiddleware((context, next) => {
  if (SAFE_METHODS.has(context.request.method)) {
    return next();
  }

  const origin = context.request.headers.get('origin');
  const allowedOrigin = origin === SITE_ORIGIN
    || (import.meta.env.DEV && origin === context.url.origin);

  if (!allowedOrigin) {
    return new Response('Cross-site form submissions are forbidden', {
      status: 403,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return next();
});
