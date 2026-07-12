import { Router } from "express";
import { authController } from "../../controllers/auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authRateLimiter } from "../../middlewares/rateLimiter.middleware.js";
import {
  registerValidator,
  loginValidator,
  googleAuthValidator,
  changePasswordValidator,
} from "../../validators/auth.validator.js";

const router = Router();

router.use(authRateLimiter);

router.post("/register", validate(registerValidator), authController.register);
router.post("/login", validate(loginValidator), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.getMe);


router.post(
  "/change-password",
  authenticate,
  validate(changePasswordValidator),
  authController.changePassword
);

router.get("/google/status", authController.googleStatus);
router.get("/google/url", authController.googleAuthUrl);
router.get("/google/callback", authController.googleCallback);
router.post("/google", validate(googleAuthValidator), authController.googleLogin);

export default router;
