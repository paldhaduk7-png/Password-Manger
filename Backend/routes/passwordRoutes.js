import express from "express";
import {addPassword ,getAllPasswords,getPassword,updatePassword, deletePassword } from "../controllers/passwordController.js";

const router= express.Router();

router.post("/addPassword",addPassword );
router.get("/", getAllPasswords); 
router.put("/:id",updatePassword );
router.delete("/:id", deletePassword );

export default router;