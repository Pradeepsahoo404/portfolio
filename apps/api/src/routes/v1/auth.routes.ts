import { Router } from "express";
import { authController } from "../../controllers/auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authRateLimiter } from "../../middlewares/rateLimiter.middleware.js";
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  verifyEmailValidator,
  resendVerificationValidator,
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

router.post("/verify-email", validate(verifyEmailValidator), authController.verifyEmail);
router.post(
  "/resend-verification",
  validate(resendVerificationValidator),
  authController.resendVerification
);

router.post(
  "/forgot-password",
  validate(forgotPasswordValidator),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validate(resetPasswordValidator),
  authController.resetPassword
);
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
