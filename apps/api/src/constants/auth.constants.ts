export const AUTH_PROVIDERS = {
  LOCAL: "local",
  GOOGLE: "google",
} as const;

export type AuthProvider =
  (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];

export const TOKEN_TYPES = {
  EMAIL_VERIFICATION: "email_verification",
  PASSWORD_RESET: "password_reset",
} as const;

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];
