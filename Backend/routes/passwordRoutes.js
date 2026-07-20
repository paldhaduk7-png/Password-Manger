import express from "express";
import {addPassword ,getPassword,updatePassword,deletePasseord } from "../controllers/passwordController.js";

const router= express.Router();

router.post("/addPassword",addPassword );
router.get("/:id",getPassword );
router.put("/:id",updatePassword );
router.delete("/:id",deletePasseord );

export default router;