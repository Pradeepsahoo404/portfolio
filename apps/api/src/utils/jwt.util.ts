import * as jwt from "jsonwebtoken";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtConfig } from "../config/index.js";
import { ERROR_CODES } from "../constants/errorCodes.constants.js";
import { UnauthorizedError } from "../errors/index.js";

export interface AccessTokenPayload {
  sub: string;
  email: string;
  role: string;
}

export interface RefreshTokenPayload {
  sub: string;
  tokenId: string;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: SignOptions = {
    expiresIn: jwtConfig.accessExpiresIn as SignOptions["expiresIn"],
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
  };
  return jwt.sign(payload, jwtConfig.accessSecret, options);
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  const options: SignOptions = {
    expiresIn: jwtConfig.refreshExpiresIn as SignOptions["expiresIn"],
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
  };
  return jwt.sign(payload, jwtConfig.refreshSecret, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    const decoded = jwt.verify(token, jwtConfig.accessSecret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    }) as JwtPayload & AccessTokenPayload;
    return {
      sub: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Access token expired", ERROR_CODES.TOKEN_EXPIRED);
    }
    throw new UnauthorizedError("Invalid access token", ERROR_CODES.TOKEN_INVALID);
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    const decoded = jwt.verify(token, jwtConfig.refreshSecret, {
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    }) as JwtPayload & RefreshTokenPayload;
    return {
      sub: decoded.sub,
      tokenId: decoded.tokenId,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Refresh token expired", ERROR_CODES.TOKEN_EXPIRED);
    }
    throw new UnauthorizedError("Invalid refresh token", ERROR_CODES.TOKEN_INVALID);
  }
}

export function getRefreshTokenExpiryDate(): Date {
  const expiresIn = jwtConfig.refreshExpiresIn;
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };
  return new Date(Date.now() + value * (multipliers[unit] ?? multipliers.d));
}
