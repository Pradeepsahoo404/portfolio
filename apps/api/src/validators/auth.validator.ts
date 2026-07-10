import { body, param, query } from "express-validator";
import { REGEX } from "../constants/regex.constants.js";

export const registerValidator = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 50 })
    .withMessage("First name cannot exceed 50 characters"),
  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 50 })
    .withMessage("Last name cannot exceed 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(REGEX.PASSWORD)
    .withMessage(
      "Password must contain uppercase, lowercase, number, and special character"
    ),
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

export const forgotPasswordValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
];

export const resetPasswordValidator = [
  body("token").notEmpty().withMessage("Reset token is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(REGEX.PASSWORD)
    .withMessage(
      "Password must contain uppercase, lowercase, number, and special character"
    ),
];

export const verifyEmailValidator = [
  body("token").notEmpty().withMessage("Verification token is required"),
];

export const resendVerificationValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
];

export const googleAuthValidator = [
  body("idToken").notEmpty().withMessage("Google ID token is required"),
];

export const changePasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(REGEX.PASSWORD)
    .withMessage(
      "Password must contain uppercase, lowercase, number, and special character"
    ),
];

export const objectIdValidator = [
  param("id").matches(REGEX.OBJECT_ID).withMessage("Invalid ID format"),
];

export const paginationValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("sort").optional().isString().withMessage("Sort must be a string"),
  query("search").optional().isString().withMessage("Search must be a string"),
];
