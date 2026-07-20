import {Password} from "../models/Password.js";
import bcrypt from "bcryptjs";


// 1) C:- Post password
export const addPassword= async (req,res)=>{
    
    try{

    const {weburl, username, password}=req.body;

    if(!weburl || !username || !password){
           return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

      //create password
    await Password.create({
      weburl,
      username,
      password
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

// 2) R:- (Create new password)
export  const getPassword= async(req,res)=>{
   
  try {
     const password = await Password.findById(req.params.id);
        
      if(!password){
        return res.status(404).json({
          message:"password is not found!!!",
          success:false
        })
      }

      if(password){
          return res.status(200).json({
          message:password.password,
          success:false
        })
      }
  } 
  
catch (error) {
    return res.status(500).json({
      message: error.message,
       success: false
    }) 
  }
}

// 3) U:- Update new password
export const updatePassword = async (req, res) => {
  try {
    const { weburl, username, password } = req.body;

    const updated = await Password.findByIdAndUpdate(
      req.params.id,
      {
        weburl,
        username,
        password,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Password not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: updated,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// 4) D:- (delet password)
export const deletePasseord = async(req,res)=>{

 try {
   const delet=await Password.findByIdAndDelete(req.params.id);

if(!delet){
   return res.status(404).json({
        success: false,
        message: "Password not found",
      });
}

    return res.status(200).json({
      success: true,
      message: "Password delete successfully",
    });

 } 

    catch (error) {
   return res.status(500).json({
      success: false,
      message: error.message,
    });
 }
} 