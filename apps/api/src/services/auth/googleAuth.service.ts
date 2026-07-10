import { OAuth2Client, type TokenPayload } from "google-auth-library";
import { googleConfig } from "../../config/index.js";
import { BadRequestError } from "../../errors/index.js";

export interface GoogleUserProfile {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isEmailVerified: boolean;
}

export class GoogleAuthService {
  private client: OAuth2Client | null = null;

  private getClient(): OAuth2Client {
    if (!googleConfig.isEnabled) {
      throw new BadRequestError("Google authentication is not configured");
    }

    if (!this.client) {
      this.client = new OAuth2Client(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.callbackUrl
      );
    }

    return this.client;
  }

  isEnabled(): boolean {
    return googleConfig.isEnabled;
  }

  getAuthUrl(): string {
    const client = this.getClient();
    return client.generateAuthUrl({
      access_type: "offline",
      scope: ["email", "profile", "openid"],
      prompt: "consent",
    });
  }

  async verifyIdToken(idToken: string): Promise<GoogleUserProfile> {
    if (!googleConfig.isEnabled) {
      throw new BadRequestError("Google authentication is not configured");
    }

    const client = this.getClient();
    const ticket = await client.verifyIdToken({
      idToken,
      audience: googleConfig.clientId,
    });

    const payload = ticket.getPayload() as TokenPayload;

    if (!payload?.email) {
      throw new BadRequestError("Google account email not available");
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      firstName: payload.given_name ?? payload.name?.split(" ")[0] ?? "User",
      lastName: payload.family_name ?? payload.name?.split(" ").slice(1).join(" ") ?? "",
      avatar: payload.picture,
      isEmailVerified: payload.email_verified ?? false,
    };
  }

  async exchangeCodeForProfile(code: string): Promise<GoogleUserProfile> {
    if (!googleConfig.isEnabled) {
      throw new BadRequestError("Google authentication is not configured");
    }

    const client = this.getClient();
    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      throw new BadRequestError("Failed to obtain Google ID token");
    }

    return this.verifyIdToken(tokens.id_token);
  }
}

export const googleAuthService = new GoogleAuthService();
export default googleAuthService;
