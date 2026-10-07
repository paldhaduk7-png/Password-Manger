import express from "express";
import { addPassword, getAllPasswords, getPassword, updatePassword, deletePassword, toggleFavorite, getDeletedPasswords, restorePassword, permanentDeletePassword, emptyTrash } from "../controllers/passwordController.js";
import isAuthenticated from "../middlewares/Autatication.js";

const router = express.Router();

router.post("/addPassword", isAuthenticated, addPassword);
router.get("/", isAuthenticated, getAllPasswords); 
router.get("/deleted", isAuthenticated, getDeletedPasswords);
router.delete("/deleted", isAuthenticated, emptyTrash);
router.get("/:id", isAuthenticated, getPassword);
router.put("/:id", isAuthenticated, updatePassword);
router.delete("/:id", isAuthenticated, deletePassword);
router.patch("/:id/favorite", isAuthenticated, toggleFavorite);
router.patch("/:id/restore", isAuthenticated, restorePassword);
router.delete("/:id/permanent", isAuthenticated, permanentDeletePassword);

export default router;