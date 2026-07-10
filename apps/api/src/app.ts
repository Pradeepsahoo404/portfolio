import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { requestIdMiddleware } from "./middlewares/requestId.middleware.js";
import { globalRateLimiter } from "./middlewares/rateLimiter.middleware.js";
import { appConfig, cookieConfig, corsConfig } from "./config/index.js";
import { logger } from "./utils/logger.util.js";
import { NotFoundError } from "./errors/index.js";

export function createApp(): Express {
  const app = express();

  app.set("trust proxy", 1);

  app.use(requestIdMiddleware);
  app.use(helmet());
  app.use(cors(corsConfig));
  app.use(compression());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use(cookieParser(cookieConfig.secret));

  if (appConfig.isDevelopment) {
    app.use(morgan("dev"));
  } else {
    app.use(
      morgan("combined", {
        stream: { write: (message) => logger.http(message.trim()) },
      })
    );
  }

  app.use(globalRateLimiter);

  app.get("/", (_req, res) => {
    res.json({
      success: true,
      message: `${appConfig.appName} is running`,
      version: "1.0.0",
      docs: `${appConfig.apiPrefix}`,
    });
  });

  app.use(routes);

  app.use((_req, _res, next) => {
    next(new NotFoundError("Route not found"));
  });

  app.use(errorMiddleware);

  return app;
}

export default createApp;
