import type { Request, Response } from "express";
import { userRepository } from "../../repositories/auth/user.repository.js";
import { userTokenRepository } from "../../repositories/auth/userToken.repository.js";
import { tokenService } from "./token.service.js";
import { emailService } from "../email/email.service.js";
import { googleAuthService } from "./googleAuth.service.js";
import {
  hashPassword,
  comparePassword,
  hashToken,
  compareToken,
} from "../../utils/hash.util.js";
import { generateSecureToken } from "../../utils/crypto.util.js";
import { addHours, isExpired } from "../../utils/date.util.js";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../../errors/index.js";
import { ERROR_CODES } from "../../constants/errorCodes.constants.js";
import { AUTH_PROVIDERS, TOKEN_TYPES } from "../../constants/auth.constants.js";
import { ROLES } from "../../constants/roles.constants.js";
import { emailConfig } from "../../config/index.js";
import type {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  GoogleAuthDto,
  ChangePasswordDto,
  ResendVerificationDto,
} from "../../dtos/auth/auth.dto.js";
import type { IUser } from "../../models/auth/user.model.js";

type SafeUser = {
  _id: unknown;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: string;
  authProvider: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export class AuthService {
  private sanitizeUser(user: IUser): SafeUser {
    const json = user.toJSON();
    return {
      _id: json._id,
      firstName: json.firstName,
      lastName: json.lastName,
      email: json.email,
      avatar: json.avatar,
      role: json.role,
      authProvider: json.authProvider,
      isEmailVerified: json.isEmailVerified,
      isActive: json.isActive,
      createdAt: json.createdAt,
      updatedAt: json.updatedAt,
    };
  }

  async register(dto: RegisterDto): Promise<{ user: SafeUser }> {
    const exists = await userRepository.emailExists(dto.email);
    if (exists) {
      throw new ConflictError("Email already registered");
    }

    const hashedPassword = await hashPassword(dto.password);

    const user = await userRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      authProvider: AUTH_PROVIDERS.LOCAL,
      role: ROLES.USER,
    } as never);

    const verificationToken = await this.createUserToken(
      user._id.toString(),
      TOKEN_TYPES.EMAIL_VERIFICATION
    );

    await emailService.sendWelcomeEmail(user.email, user.firstName, verificationToken);

    return { user: this.sanitizeUser(user) };
  }

  async login(
    dto: LoginDto,
    req: Request,
    res: Response
  ): Promise<{ user: SafeUser; accessToken: string }> {
    const user = await userRepository.findByEmail(dto.email);

    if (!user || !user.password) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new ForbiddenError("Account is deactivated");
    }

    const isPasswordValid = await comparePassword(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isEmailVerified && user.authProvider === AUTH_PROVIDERS.LOCAL) {
      throw new UnauthorizedError(
        "Please verify your email before logging in",
        ERROR_CODES.EMAIL_NOT_VERIFIED
      );
    }

    await userRepository.updateLastLogin(user._id.toString());

    const tokens = await tokenService.generateTokenPair(
      user,
      req.headers["user-agent"],
      req.ip
    );

    tokenService.setRefreshTokenCookie(res, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
    };
  }

  async refresh(req: Request, res: Response) {
    const signedCookies = req.signedCookies as Record<string, string> | undefined;
    const refreshToken =
      signedCookies?.refreshToken ??
      (req.body as { refreshToken?: string }).refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token not provided");
    }

    const result = await tokenService.refreshAccessToken(
      refreshToken,
      req.headers["user-agent"],
      req.ip
    );

    tokenService.setRefreshTokenCookie(res, result.refreshToken);

    return {
      user: this.sanitizeUser(result.user),
      accessToken: result.accessToken,
    };
  }

  async logout(req: Request, res: Response): Promise<void> {
    const signedCookies = req.signedCookies as Record<string, string> | undefined;
    const refreshToken = signedCookies?.refreshToken;

    if (refreshToken) {
      await tokenService.revokeRefreshToken(refreshToken);
    }

    if (req.user) {
      await tokenService.revokeAllUserTokens(req.user._id.toString());
    }

    tokenService.clearRefreshTokenCookie(res);
  }

  async getMe(userId: string): Promise<SafeUser> {
    const user = await userRepository.findByIdOrFail(userId);
    return this.sanitizeUser(user);
  }

  async verifyEmail(dto: VerifyEmailDto): Promise<{ message: string }> {
    const { user, tokenDocId } = await this.validateUserToken(
      dto.token,
      TOKEN_TYPES.EMAIL_VERIFICATION
    );

    await userRepository.update(user._id.toString(), {
      isEmailVerified: true,
    } as never);

    await userTokenRepository.markAsUsed(tokenDocId);

    return { message: "Email verified successfully" };
  }

  async resendVerification(dto: ResendVerificationDto): Promise<{ message: string }> {
    const user = await userRepository.findByEmailPublic(dto.email);

    if (!user) {
      return { message: "If the email exists, a verification link has been sent" };
    }

    if (user.isEmailVerified) {
      throw new BadRequestError("Email is already verified");
    }

    await userTokenRepository.invalidateUserTokens(
      user._id.toString(),
      TOKEN_TYPES.EMAIL_VERIFICATION
    );

    const verificationToken = await this.createUserToken(
      user._id.toString(),
      TOKEN_TYPES.EMAIL_VERIFICATION
    );

    await emailService.sendVerificationEmail(user.email, user.firstName, verificationToken);

    return { message: "If the email exists, a verification link has been sent" };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await userRepository.findByEmailPublic(dto.email);

    if (!user || user.authProvider !== AUTH_PROVIDERS.LOCAL) {
      return { message: "If the email exists, a reset link has been sent" };
    }

    await userTokenRepository.invalidateUserTokens(
      user._id.toString(),
      TOKEN_TYPES.PASSWORD_RESET
    );

    const resetToken = await this.createUserToken(
      user._id.toString(),
      TOKEN_TYPES.PASSWORD_RESET
    );

    await emailService.sendPasswordResetEmail(user.email, user.firstName, resetToken);

    return { message: "If the email exists, a reset link has been sent" };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const { user, tokenDocId } = await this.validateUserToken(
      dto.token,
      TOKEN_TYPES.PASSWORD_RESET
    );

    const hashedPassword = await hashPassword(dto.password);

    await userRepository.update(user._id.toString(), {
      password: hashedPassword,
    } as never);

    await userTokenRepository.markAsUsed(tokenDocId);
    await tokenService.revokeAllUserTokens(user._id.toString());

    return { message: "Password reset successfully" };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    const existingUser = await userRepository.findByIdOrFail(userId);
    const user = await userRepository.findByEmail(existingUser.email);

    if (!user?.password) {
      throw new BadRequestError("Password change not available for this account");
    }

    const isValid = await comparePassword(dto.currentPassword, user.password);
    if (!isValid) {
      throw new UnauthorizedError("Current password is incorrect");
    }

    const hashedPassword = await hashPassword(dto.newPassword);
    await userRepository.update(userId, { password: hashedPassword } as never);
    await tokenService.revokeAllUserTokens(userId);

    return { message: "Password changed successfully" };
  }

  async googleLogin(
    dto: GoogleAuthDto,
    req: Request,
    res: Response
  ): Promise<{ user: SafeUser; accessToken: string }> {
    const profile = await googleAuthService.verifyIdToken(dto.idToken);
    const user = await this.findOrCreateGoogleUser(profile);

    if (!user.isActive) {
      throw new ForbiddenError("Account is deactivated");
    }

    await userRepository.updateLastLogin(user._id.toString());

    const tokens = await tokenService.generateTokenPair(
      user,
      req.headers["user-agent"],
      req.ip
    );

    tokenService.setRefreshTokenCookie(res, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
    };
  }

  async googleCallback(
    code: string,
    req: Request,
    res: Response
  ): Promise<{ user: SafeUser; accessToken: string }> {
    const profile = await googleAuthService.exchangeCodeForProfile(code);
    const user = await this.findOrCreateGoogleUser(profile);

    if (!user.isActive) {
      throw new ForbiddenError("Account is deactivated");
    }

    await userRepository.updateLastLogin(user._id.toString());

    const tokens = await tokenService.generateTokenPair(
      user,
      req.headers["user-agent"],
      req.ip
    );

    tokenService.setRefreshTokenCookie(res, tokens.refreshToken);

    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
    };
  }

  getGoogleAuthUrl(): { url: string } {
    if (!googleAuthService.isEnabled()) {
      throw new BadRequestError("Google authentication is not configured");
    }
    return { url: googleAuthService.getAuthUrl() };
  }

  private async findOrCreateGoogleUser(profile: {
    googleId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    isEmailVerified: boolean;
  }): Promise<IUser> {
    let user = await userRepository.findByGoogleId(profile.googleId);

    if (user) return user;

    user = await userRepository.findByEmailPublic(profile.email);

    if (user) {
      await userRepository.update(user._id.toString(), {
        googleId: profile.googleId,
        authProvider: AUTH_PROVIDERS.GOOGLE,
        isEmailVerified: profile.isEmailVerified || user.isEmailVerified,
        avatar: profile.avatar ?? user.avatar,
      } as never);
      return userRepository.findByIdOrFail(user._id.toString());
    }

    return userRepository.create({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email.toLowerCase(),
      googleId: profile.googleId,
      authProvider: AUTH_PROVIDERS.GOOGLE,
      isEmailVerified: profile.isEmailVerified,
      avatar: profile.avatar,
      role: ROLES.USER,
    } as never);
  }

  private async createUserToken(
    userId: string,
    type: (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES]
  ): Promise<string> {
    const rawToken = generateSecureToken();
    const tokenHash = await hashToken(rawToken);

    const expiresHours =
      type === TOKEN_TYPES.EMAIL_VERIFICATION
        ? emailConfig.verificationExpiresHours
        : emailConfig.resetExpiresHours;

    await userTokenRepository.createToken({
      userId,
      tokenHash,
      type,
      expiresAt: addHours(new Date(), expiresHours),
    } as never);

    return rawToken;
  }

  private async validateUserToken(
    rawToken: string,
    type: (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES]
  ): Promise<{ user: IUser; tokenDocId: string }> {
    const tokens = await userTokenRepository.findActiveTokens(type);

    for (const tokenDoc of tokens) {
      const isMatch = await compareToken(rawToken, tokenDoc.tokenHash);
      if (!isMatch) continue;

      if (isExpired(tokenDoc.expiresAt)) {
        throw new BadRequestError("Token has expired");
      }

      const user = await userRepository.findById(tokenDoc.userId.toString());
      if (!user) {
        throw new NotFoundError("User not found");
      }

      return { user, tokenDocId: tokenDoc._id.toString() };
    }

    throw new BadRequestError("Invalid or expired token");
  }
}

export const authService = new AuthService();
export default authService;
