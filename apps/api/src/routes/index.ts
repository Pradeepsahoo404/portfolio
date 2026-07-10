import { Router } from "express";
import v1Routes from "./v1/index.js";
import healthRoutes from "./health.routes.js";
import { appConfig } from "../config/index.js";

const router = Router();

router.use("/health", healthRoutes);
router.use(appConfig.apiPrefix, v1Routes);

export default router;
