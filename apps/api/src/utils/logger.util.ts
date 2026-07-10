import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import * as path from "path";
import { appConfig, logConfig } from "../config/index.js";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, stack, requestId }) => {
  const reqPart = requestId ? `[${requestId}] ` : "";
  const base = `${ts} ${level}: ${reqPart}${message}`;
  return stack ? `${base}\n${stack}` : base;
});

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: combine(
      colorize({ all: appConfig.isDevelopment }),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      logFormat
    ),
  }),
];

if (!appConfig.isTest) {
  transports.push(
    new DailyRotateFile({
      dirname: path.resolve(logConfig.dir),
      filename: "app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      maxSize: "20m",
      format: combine(timestamp(), errors({ stack: true }), logFormat),
    }),
    new DailyRotateFile({
      dirname: path.resolve(logConfig.dir),
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "30d",
      maxSize: "20m",
      format: combine(timestamp(), errors({ stack: true }), logFormat),
    })
  );
}

export const logger = winston.createLogger({
  level: logConfig.level,
  transports,
  exitOnError: false,
});

export default logger;
