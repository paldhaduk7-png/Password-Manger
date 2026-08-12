import { Password } from "../models/Password.js";
import mongoose from "mongoose";

// 1) C:- Create / Post password
export const addPassword = async (req, res) => {
  try {
    let { weburl, username, password } = req.body;

    weburl = weburl?.trim();
    username = username?.trim();
    password = password?.trim();

    if (!weburl || !username || !password) {
      return res.status(400).json({
        message: "All fields are required (Website URL, Username, and Password)",
        success: false,
      });
    }

    // create password associated with authenticated user
    const newPassword = await Password.create({
      weburl,
      username,
      password,
      user: req.id,
    });

    return res.status(201).json({
      message: "Password stored successfully in your secure vault",
      success: true,
      data: newPassword,
    });
  } catch (error) {
    console.error("Add password error:", error);
    return res.status(500).json({
      message: error.message || "Something went wrong while saving password",
      success: false,
    });
  }
};

// 2) R:- Get all passwords for authenticated user (favorites first, then newest)
export const getAllPasswords = async (req, res) => {
  try {
    const passwords = await Password.find({ user: req.id }).sort({
      isFavorite: -1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: passwords,
    });
  } catch (error) {
    console.error("Get all passwords error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch passwords from vault",
    });
  }
};

// 2.1) R:- Get single password by id with ownership check
export const getPassword = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid credential ID provided",
      });
    }

    const password = await Password.findOne({
      _id: id,
      user: req.id,
    });

    if (!password) {
      return res.status(404).json({
        success: false,
        message: "Credential not found in your vault",
      });
    }

    return res.status(200).json({
      success: true,
      data: password,
    });
  } catch (error) {
    console.error("Get password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch password details",
    });
  }
};

// 3) U:- Update password with ownership check & partial safety
export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid credential ID provided",
      });
    }

    const { weburl, username, password, isFavorite } = req.body;

    const updateFields = {};
    if (weburl !== undefined) updateFields.weburl = weburl.trim();
    if (username !== undefined) updateFields.username = username.trim();
    if (password !== undefined) updateFields.password = password.trim();
    if (typeof isFavorite === "boolean") {
      updateFields.isFavorite = isFavorite;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const updated = await Password.findOneAndUpdate(
      {
        _id: id,
        user: req.id,
      },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Credential not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Credential updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update credential",
    });
  }
};

// 4) D:- Delete password with ownership check
export const deletePassword = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid credential ID provided",
      });
    }

    const deleted = await Password.findOneAndDelete({
      _id: id,
      user: req.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Credential not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Credential deleted successfully from vault",
    });
  } catch (error) {
    console.error("Delete password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete credential",
    });
  }
};

// 5) Toggle Favorite / Pinned status
export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid credential ID provided",
      });
    }

    const password = await Password.findOne({
      _id: id,
      user: req.id,
    });

    if (!password) {
      return res.status(404).json({
        success: false,
        message: "Credential not found or unauthorized",
      });
    }

    password.isFavorite = !password.isFavorite;
    await password.save();

    return res.status(200).json({
      success: true,
      message: password.isFavorite ? "Added to favorites ⭐" : "Removed from favorites",
      data: password,
    });
  } catch (error) {
    console.error("Toggle favorite error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to toggle favorite status",
    });
  }
};