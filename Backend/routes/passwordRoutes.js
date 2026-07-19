import express from "express";
import {addPassword } from "../controllers/passwordController.js";

const router= express.Router();

router.post("/addPassword",addPassword );

export default router;