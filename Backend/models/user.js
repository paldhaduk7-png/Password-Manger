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
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: "",
        trim: true
    }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);