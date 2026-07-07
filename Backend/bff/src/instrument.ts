import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.GLITCHTIP_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV || "development",
});
