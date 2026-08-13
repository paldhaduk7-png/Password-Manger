import express from "express";
import { 
  register, 
  Login, 
  logout, 
  updateProfile, 
  getProfile,
  forgotPassword,
  verifyOtp,
  resetPasswordWithOtp
} from "../controllers/user.js";
import isAuthenticated from "../middlewares/Autatication.js";
import { singleUpload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/register", singleUpload, register);
router.post("/login", Login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password-otp", resetPasswordWithOtp);
router.put("/update-profile", isAuthenticated, singleUpload, updateProfile);
router.get("/profile", isAuthenticated, getProfile);

export default router;


