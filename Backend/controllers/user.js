import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, phonenumber, password, bio } = req.body;
    if (!fullname || !email || !phonenumber || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      return res.status(400).json({
        message: "Email is Already Exist",
        success: false,
      });
    }

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
        return res.status(400).json({
          message: `Cloudinary Error (${cloudErr.http_code || 403}): ${cloudErr.message || "Invalid Cloudinary API keys"}. Please verify CLOUD_NAME, API_KEY, and API_SECRET in Backend/.env.`,
          success: false,
        });
      }
    }

    let hasedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email: email.toLowerCase(),
      phonenumber,
      password: hasedPassword,
      bio: bio || "",
      profilePicture: profilePictureUrl,
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: error.message || "Something went wrong during registration",
      success: false,
    });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // check email exist
    let user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email",
        success: false,
      });
    }

    // check password exist
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
    }

    // now generate token for user
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
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

    // store token in cookie
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: userData,
        success: true,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong during logout",
      success: false,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { fullname, phonenumber, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Upload req.file.buffer to Cloudinary using upload_stream
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
          message: `Cloudinary Error (${cloudErr.http_code || 403}): ${cloudErr.message || "Invalid Cloudinary API keys"}. Please verify CLOUD_NAME, API_KEY, and API_SECRET in Backend/.env.`,
          success: false,
        });
      }
    }

    if (fullname) user.fullname = fullname;
    if (phonenumber) user.phonenumber = phonenumber;
    if (bio !== undefined) user.bio = bio;

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
    return res.status(500).json({
      message: error.message || "Failed to fetch profile",
      success: false,
    });
  }
};