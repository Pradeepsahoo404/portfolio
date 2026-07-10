import * as crypto from "crypto";

export function generateSecureToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

export function generateOTP(length = 6): string {
  const max = Math.pow(10, length) - 1;
  const min = Math.pow(10, length - 1);
  return crypto.randomInt(min, max + 1).toString();
}

export function hashSha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}
