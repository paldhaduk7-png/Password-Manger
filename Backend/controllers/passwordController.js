import {Password} from "../models/Password.js";



// 1) C:- Post password
export const addPassword = async (req, res) => {
  try {
    const { weburl, username, password } = req.body;

    if (!weburl || !username || !password) {
      return res.status(400).json({
        message: "All fields are required",
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
      message: "Password stored successfully",
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

// 2) R:- (get all passwords for authenticated user)
export const getAllPasswords = async (req, res) => {
  try {
    const passwords = await Password.find({ user: req.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: passwords,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch passwords",
    });
  }
};

// 2.1) R:- (get single password by id with ownership check)
export const getPassword = async (req, res) => {
  try {
    const password = await Password.findOne({
      _id: req.params.id,
      user: req.id,
    });

    if (!password) {
      return res.status(404).json({
        success: false,
        message: "Password not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      data: password,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch password details",
    });
  }
};

// 3) U:- Update password with ownership check
export const updatePassword = async (req, res) => {
  try {
    const { weburl, username, password } = req.body;

    const updated = await Password.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.id,
      },
      {
        weburl,
        username,
        password,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Password not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update password",
    });
  }
};

// 4) D:- Delete password with ownership check
export const deletePassword = async (req, res) => {
  try {
    const deleted = await Password.findOneAndDelete({
      _id: req.params.id,
      user: req.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Password not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete password",
    });
  }
};