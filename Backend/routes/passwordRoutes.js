import express from "express";
import { addPassword, getAllPasswords, getPassword, updatePassword, deletePassword, toggleFavorite } from "../controllers/passwordController.js";
import isAuthenticated from "../middlewares/Autatication.js";

const router = express.Router();

router.post("/addPassword", isAuthenticated, addPassword);
router.get("/", isAuthenticated, getAllPasswords); 
router.get("/:id", isAuthenticated, getPassword);
router.put("/:id", isAuthenticated, updatePassword);
router.delete("/:id", isAuthenticated, deletePassword);
router.patch("/:id/favorite", isAuthenticated, toggleFavorite);

export default router;