import { Router } from "express";
import authRoutes from "./auth.routes.js";
import mediaRoutes from "./media.routes.js";
import publicRoutes from "./public.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/media", mediaRoutes);
router.use("/admin", adminRoutes);
router.use("/public/:workspaceSlug", publicRoutes);

export default router;
