import { env } from "./env.schema.js";

export const emailConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  from: env.EMAIL_FROM,
  verificationExpiresHours: env.EMAIL_VERIFICATION_EXPIRES_HOURS,
  resetExpiresHours: env.PASSWORD_RESET_EXPIRES_HOURS,
} as const;
