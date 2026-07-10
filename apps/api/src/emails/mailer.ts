import nodemailer from "nodemailer";
import Handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";
import { emailConfig, appConfig } from "../config/index.js";
import { logger } from "../utils/logger.util.js";

const templatesDir = path.join(process.cwd(), "src/emails/templates");

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: emailConfig.auth,
    });
  }
  return transporter;
}

async function compileTemplate(
  templatePath: string,
  data: Record<string, unknown>
): Promise<string> {
  const fullPath = path.join(templatesDir, templatePath);
  const source = await fs.readFile(fullPath, "utf-8");
  const template = Handlebars.compile(source);
  return template({ ...data, appName: appConfig.appName, year: new Date().getFullYear() });
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const { to, subject, template, data } = options;

  try {
    const html = await compileTemplate(template, data);

    await getTransporter().sendMail({
      from: emailConfig.from,
      to,
      subject,
      html,
    });

    logger.info(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    logger.error(`Failed to send email to ${to}`, { error });
    throw error;
  }
}

export async function verifyEmailConnection(): Promise<boolean> {
  try {
    await getTransporter().verify();
    logger.info("Email server connection verified");
    return true;
  } catch (error) {
    logger.warn("Email server connection failed", { error });
    return false;
  }
}
