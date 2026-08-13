import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail, { generateOtpEmail } from "../utils/sendEmail.js";

// --- STEP 1: FORGOT PASSWORD (OTP GENERATION & DISPATCH) ---
export const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    email = email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Please provide your registered email address",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "No account found with this email address",
        success: false,
      });
    }

    // Generate secure 6-digit numeric OTP (e.g. "849201")
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP using SHA-256 and store in database with 10-minute expiration
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    user.resetOtp = hashedOtp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send email using Nodemailer utility with HTML & CSS template
    try {
      await sendEmail(
        user.email,
        "PassOP - Password Reset Verification Code",
        `Your PassOP master password reset verification code is: ${otp} (Valid for 10 minutes)`,
        generateOtpEmail(otp, user.fullname)
      );

      return res.status(200).json({
        message: "OTP sent successfully",
        success: true,
      });
    } catch (mailError) {
      console.error("Nodemailer dispatch error:", mailError);
      // Clean up OTP on email failure
      user.resetOtp = null;
      user.resetOtpExpire = null;
      await user.save();

      return res.status(500).json({
        message:
          mailError.message ||
          "Failed to dispatch verification email. Please check email credentials in .env.",
        success: false,
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: error.message || "Failed to process forgot password request",
      success: false,
    });
  }
};

// --- STEP 2: VERIFY OTP ---
export const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    email = email?.trim().toLowerCase();
    otp = otp?.trim();

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and 6-digit OTP are required",
        success: false,
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Verification code must be a 6-digit number",
        success: false,
      });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      email,
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification code (OTP). Please check and try again.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "OTP verified successfully! You can now set a new password.",
      success: true,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      message: error.message || "Failed to verify OTP",
      success: false,
    });
  }
};

// --- STEP 3: RESET PASSWORD WITH VERIFIED OTP ---
export const resetPasswordWithOtp = async (req, res) => {
  try {
    let { email, otp, password, confirmPassword } = req.body;

    email = email?.trim().toLowerCase();
    otp = otp?.trim();
    password = password?.trim();
    confirmPassword = confirmPassword?.trim();

    if (!email || !otp || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required (Email, 6-digit OTP, Password, and Confirm Password)",
        success: false,
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "Verification code must be a 6-digit number",
        success: false,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        success: false,
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Master password must be at least 6 characters long",
        success: false,
      });
    }

    // Hash incoming OTP with SHA-256 to compare with stored hash
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    // Search user with matching email, valid OTP hash, and unexpired timestamp
    const user = await User.findOne({
      email,
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification code (OTP). Please request a new code.",
        success: false,
      });
    }

    // Hash new password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetOtp = null;
    user.resetOtpExpire = null;

    await user.save();

    return res.status(200).json({
      message: "Master password reset successfully! You can now log in.",
      success: true,
    });
  } catch (error) {
    console.error("Reset password with OTP error:", error);
    return res.status(500).json({
      message: error.message || "Failed to reset master password",
      success: false,
    });
  }
};
