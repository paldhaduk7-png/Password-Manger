import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register=async(req,res)=>{
    try {
         const {fullname,email,phonenumber,password}=req.body;

    if(!fullname || !email || !phonenumber || !password){
        return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

 let user= await User.findOne({ email: email.toLowerCase() });
 if(user){
     return res.status(400).json({
        message: "Email is Alrady Exist",
        success: false,
      });
 }       

 let hasedPassword=await bcrypt.hash(password,10);

 await User.create({
    fullname,
    email,
    phonenumber,
    password:hasedPassword
 })
         return res.status(201).json({
      message: "Account create successfully",
      success: true,
    });

    } catch (error) {
           return res.status(500).json({
        message: error.message || "Something went wrong during registration",
        success: false,
      });
  }
    }


export const Login= async(req,res)=>{
    try{
       const {email,password}=req.body;
         
         if( !email ||  !password){
        return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
     
    //chaeck email exist
    let user = await User.findOne({email  :email.toLowerCase() });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email",
        success: false,
      });
    }

    //check password exist
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect password",
        success: false,
      });
    }

    //now genarate token for user
    const tokenData = {
      userId: user._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phonenumber: user.phonenumber,
    };

    
    //store token in cookie
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });

    }catch(error){
        res.status(500).json({
            message: "Login failed",
            success:false
        })
    }

}

export const logout= async(req,res)=>{
    try {
      //expier from cookie
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong during logout",
            success:false
        })
    }
}