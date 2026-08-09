import express from "express";
import { register, Login, logout, updateProfile, getProfile } from "../controllers/user.js";
import isAuthenticated from "../middlewares/Autatication.js";
import { singleUpload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/register", singleUpload, register);
router.post("/login", Login);
router.post("/logout", logout);
router.put("/update-profile", isAuthenticated, singleUpload, updateProfile);
router.get("/profile", isAuthenticated, getProfile);

export default router;
