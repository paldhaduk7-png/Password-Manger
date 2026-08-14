import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phonenumber: {
        type: String,
        default: "",
        trim: true
    },
    password: {
        type: String,
        default: ""
    },
    googleId: {
        type: String,
        default: null
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    profilePicture: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: "",
        trim: true
    },
    resetOtp: {
        type: String,
        default: null
    },
    resetOtpExpire: {
        type: Date,
        default: null
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpire: {
        type: Date,
        default: null
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);