import rateLimit from "express-rate-limit";
import { rateLimitConfig } from "../config/index.js";

export const globalRateLimiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.max,
  message: {
    success: false,
    message: rateLimitConfig.message,
    errorCode: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: rateLimitConfig.standardHeaders,
  legacyHeaders: rateLimitConfig.legacyHeaders,
});

export const authRateLimiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.authMax,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
    errorCode: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default globalRateLimiter;
