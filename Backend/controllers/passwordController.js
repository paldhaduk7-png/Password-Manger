import {Password} from "../models/Password.js";
import bcrypt from "bcryptjs";

export const addPassword= async (req,res)=>{
    
    try{

    const {weburl, username, password}=req.body;

    if(!weburl || !username || !password){
           return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

 const hashedPassword = await bcrypt.hash(password, 10);

      //create password
    await Password.create({
      weburl,
      username,
      password: hashedPassword,
    });

       return res.status(201).json({
      message: "Password Store sucesfully",
      success: true,
    });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message || "Something went wrong during registration",
            success: false,
        });
    }

}