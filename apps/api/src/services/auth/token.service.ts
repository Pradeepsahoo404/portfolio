import type { Response } from "express";
import { cookieConfig, jwtConfig } from "../../config/index.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiryDate,
  type AccessTokenPayload,
} from "../../utils/jwt.util.js";
import { hashToken, compareToken } from "../../utils/hash.util.js";
import { refreshTokenRepository } from "../../repositories/auth/refreshToken.repository.js";
import { userRepository } from "../../repositories/auth/user.repository.js";
import { UnauthorizedError } from "../../errors/index.js";
import { ERROR_CODES } from "../../constants/errorCodes.constants.js";
import type { IUser } from "../../models/auth/user.model.js";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export class TokenService {
  generateAccessToken(user: IUser): string {
    const payload: AccessTokenPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    return signAccessToken(payload);
  }

  async generateRefreshToken(
    user: IUser,
    userAgent?: string,
    ipAddress?: string
  ): Promise<string> {
    const placeholderHash = await hashToken(cryptoRandom());
    const storedToken = await refreshTokenRepository.createToken({
      userId: user._id,
      tokenHash: placeholderHash,
      expiresAt: getRefreshTokenExpiryDate(),
      userAgent,
      ipAddress,
    } as never);

    const refreshToken = signRefreshToken({
      sub: user._id.toString(),
      tokenId: storedToken._id.toString(),
    });

    const tokenHash = await hashToken(refreshToken);
    await refreshTokenRepository.update(storedToken._id.toString(), {
      tokenHash,
    } as never);

    return refreshToken;
  }

  async generateTokenPair(
    user: IUser,
    userAgent?: string,
    ipAddress?: string
  ): Promise<AuthTokens> {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user, userAgent, ipAddress);

    return {
      accessToken,
      refreshToken,
      expiresIn: jwtConfig.accessExpiresIn,
    };
  }

  setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie(cookieConfig.refreshTokenName, refreshToken, {
      httpOnly: cookieConfig.httpOnly,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: cookieConfig.path,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      signed: true,
    });
  }

  clearRefreshTokenCookie(res: Response): void {
    res.clearCookie(cookieConfig.refreshTokenName, {
      httpOnly: cookieConfig.httpOnly,
      secure: cookieConfig.secure,
      sameSite: cookieConfig.sameSite,
      path: cookieConfig.path,
    });
  }

  async refreshAccessToken(
    refreshToken: string,
    userAgent?: string,
    ipAddress?: string
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
    const payload = verifyRefreshToken(refreshToken);

    const storedToken = await refreshTokenRepository.findValidToken(
      payload.sub,
      payload.tokenId
    );

    if (!storedToken) {
      throw new UnauthorizedError("Invalid refresh token", ERROR_CODES.TOKEN_INVALID);
    }

    const isMatch = await compareToken(refreshToken, storedToken.tokenHash);
    if (!isMatch) {
      await refreshTokenRepository.revokeToken(storedToken._id.toString());
      throw new UnauthorizedError("Invalid refresh token", ERROR_CODES.TOKEN_INVALID);
    }

    await refreshTokenRepository.revokeToken(storedToken._id.toString());

    const user = await userRepository.findById(payload.sub);
    if (!user || !user.isActive) {
      throw new UnauthorizedError("User not found or inactive");
    }

    const newAccessToken = this.generateAccessToken(user);
    const newRefreshToken = await this.generateRefreshToken(user, userAgent, ipAddress);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user,
    };
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const storedToken = await refreshTokenRepository.findValidToken(
        payload.sub,
        payload.tokenId
      );

      if (storedToken) {
        const isMatch = await compareToken(refreshToken, storedToken.tokenHash);
        if (isMatch) {
          await refreshTokenRepository.revokeToken(storedToken._id.toString());
        }
      }
    } catch {
      // Logout is idempotent
    }
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await refreshTokenRepository.revokeAllUserTokens(userId);
  }
}

function cryptoRandom(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const tokenService = new TokenService();
export default tokenService;
