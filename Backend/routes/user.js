import express from "express";
import { 
  register, 
  Login, 
  logout, 
  updateProfile, 
  getProfile,
  googleAuth
} from "../controllers/user.js";
import isAuthenticated from "../middlewares/Autatication.js";
import { singleUpload } from "../middlewares/upload.js";
import otpRoutes from "./otpRoutes.js";

const router = express.Router();

// --- User Authentication & Profile Routes ---
router.post("/register", singleUpload, register);
router.post("/login", Login);
router.post("/google", googleAuth);
router.post("/logout", logout);
router.get("/profile", isAuthenticated, getProfile);
router.put("/update-profile", isAuthenticated, singleUpload, updateProfile);

// --- Separate OTP & Password Reset Routes ---
router.use("/", otpRoutes);

export default router;
