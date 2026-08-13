import express from "express";
import { forgotPassword, verifyOtp, resetPasswordWithOtp } from "../controllers/otpController.js";

const router = express.Router();

// Password Reset & OTP Endpoints
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password-otp", resetPasswordWithOtp);

export default router;
