import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import cloudinary from "../config/cloudinary.js";
import { sendEmail, generateOtpEmail } from "../utils/sendEmail.js";

// Helper to determine cookie options
const getCookieOptions = () => ({
  maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  httpOnly: true,
  sameSite: "lax",
  path: "/",
});

export const register = async (req, res) => {
  try {
    let { fullname, email, phonenumber, password, bio } = req.body;

    fullname = fullname?.trim();
    email = email?.trim().toLowerCase();
    phonenumber = phonenumber ? String(phonenumber).trim() : "";
    bio = bio?.trim() || "";

    if (!fullname || !email || !phonenumber || !password) {
      return res.status(400).json({
        message: "All fields are required (Full name, Email, Phone number, and Password)",
        success: false,
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "An account with this email already exists",
        success: false,
      });
    }

    // Check if phonenumber already exists
    const existingPhone = await User.findOne({ phonenumber });
    if (existingPhone) {
      return res.status(400).json({
        message: "An account with this phone number already exists",
        success: false,
      });
    }

    // Profile picture upload (optional)
    let profilePictureUrl = "";
    if (req.file && req.file.buffer) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "user_profiles", resource_type: "image" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
        profilePictureUrl = uploadResult.secure_url;
      } catch (cloudErr) {
        console.error("Cloudinary error during registration:", cloudErr);
        // Do not crash registration if image upload service is temporarily unreachable or misconfigured
        profilePictureUrl = "";
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phonenumber,
      password: hashedPassword,
      bio,
      profilePicture: profilePictureUrl,
    });

    return res.status(201).json({
      message: "Account created successfully! Please log in.",
      success: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || "field";
      return res.status(400).json({
        message: `An account with this ${field} already exists`,
        success: false,
      });
    }
    return res.status(500).json({
      message: error.message || "Something went wrong during registration",
      success: false,
    });
  }
};

export const Login = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    // Check user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    // Generate JWT token
    const tokenData = {
      userId: user._id,
    };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phonenumber: user.phonenumber,
      bio: user.bio || "",
      profilePicture: user.profilePicture || "",
    };

    return res
      .status(200)
      .cookie("token", token, getCookieOptions())
      .json({
        message: `Welcome back, ${user.fullname}!`,
        user: userData,
        success: true,
      });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Login failed due to a server error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        ...getCookieOptions(),
        maxAge: 0,
        expires: new Date(0),
      })
      .json({
        message: "Logged out successfully",
        success: true,
      });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      message: error.message || "Something went wrong during logout",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    let { fullname, phonenumber, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if new phonenumber is already taken by another user
    if (phonenumber !== undefined) {
      const trimmedPhone = String(phonenumber).trim();
      if (trimmedPhone && trimmedPhone !== user.phonenumber) {
        const existingPhone = await User.findOne({
          phonenumber: trimmedPhone,
          _id: { $ne: userId },
        });
        if (existingPhone) {
          return res.status(400).json({
            message: "Phone number is already associated with another account",
            success: false,
          });
        }
        user.phonenumber = trimmedPhone;
      }
    }

    // Upload new profile picture to Cloudinary if provided
    if (req.file && req.file.buffer) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "user_profiles", resource_type: "image" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        user.profilePicture = uploadResult.secure_url;
      } catch (cloudErr) {
        console.error("Cloudinary error during profile update:", cloudErr);
        return res.status(400).json({
          message: "Failed to upload profile picture. Please check image format and size.",
          success: false,
        });
      }
    }

    if (fullname !== undefined && fullname.trim()) user.fullname = fullname.trim();
    if (bio !== undefined) user.bio = bio.trim();

    await user.save();

    const updatedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phonenumber: user.phonenumber,
      bio: user.bio || "",
      profilePicture: user.profilePicture || "",
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Phone number is already associated with another account",
        success: false,
      });
    }
    return res.status(500).json({
      message: error.message || "Failed to update profile",
      success: false,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      message: error.message || "Failed to fetch profile",
      success: false,
    });
  }
};

// --- FORGOT PASSWORD (OTP GENERATION & DISPATCH) ---
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

    const genericSuccessMessage = "If an account exists with this email, a 6-digit verification code has been sent to your inbox.";

    const user = await User.findOne({ email });
    // Security: return generic success message even if user does not exist to prevent account enumeration
    if (!user) {
      return res.status(200).json({
        message: genericSuccessMessage,
        success: true,
      });
    }

    // Generate secure 6-digit numeric OTP (e.g. "849201")
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Hash OTP using SHA-256 and store in database with 10-minute expiration
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    user.resetOtp = hashedOtp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send email using Nodemailer utility
    try {
      await sendEmail({
        to: user.email,
        subject: "PassOP - Password Reset Verification Code",
        html: generateOtpEmail(otp, user.fullname),
        text: `Your PassOP master password reset verification code is: ${otp} (Valid for 10 minutes)`,
      });

      return res.status(200).json({
        message: genericSuccessMessage,
        success: true,
      });
    } catch (mailError) {
      console.error("Nodemailer dispatch error:", mailError);
      // Clean up OTP on email failure
      user.resetOtp = null;
      user.resetOtpExpire = null;
      await user.save();

      return res.status(500).json({
        message: mailError.message || "Failed to dispatch verification email. Please check email credentials in .env.",
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


