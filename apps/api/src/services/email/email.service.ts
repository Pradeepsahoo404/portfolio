import { sendEmail } from "../../emails/mailer.js";
import { appConfig, emailConfig } from "../../config/index.js";

export class EmailService {
  async sendWelcomeEmail(
    to: string,
    firstName: string,
    verificationToken: string
  ): Promise<void> {
    const verificationUrl = `${appConfig.clientUrl}/verify-email?token=${verificationToken}`;

    await sendEmail({
      to,
      subject: `Welcome to ${appConfig.appName}`,
      template: "auth/welcome.hbs",
      data: {
        firstName,
        verificationUrl,
        expiresHours: emailConfig.verificationExpiresHours,
      },
    });
  }

  async sendVerificationEmail(
    to: string,
    firstName: string,
    verificationToken: string
  ): Promise<void> {
    const verificationUrl = `${appConfig.clientUrl}/verify-email?token=${verificationToken}`;

    await sendEmail({
      to,
      subject: "Verify your email address",
      template: "auth/emailVerification.hbs",
      data: {
        firstName,
        verificationUrl,
        expiresHours: emailConfig.verificationExpiresHours,
      },
    });
  }

  async sendPasswordResetEmail(
    to: string,
    firstName: string,
    resetToken: string
  ): Promise<void> {
    const resetUrl = `${appConfig.clientUrl}/reset-password?token=${resetToken}`;

    await sendEmail({
      to,
      subject: "Reset your password",
      template: "auth/passwordReset.hbs",
      data: {
        firstName,
        resetUrl,
        expiresHours: emailConfig.resetExpiresHours,
      },
    });
  }
}

export const emailService = new EmailService();
export default emailService;
