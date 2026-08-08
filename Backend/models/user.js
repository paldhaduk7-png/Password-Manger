import mongoose  from "mongoose";

const userSchema=mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phonenumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
    type: String,
    required: true
},
    profilePicture: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    }
},{timestamps: true})

export const User=mongoose.model('User', userSchema);