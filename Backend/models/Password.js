import mongoose from "mongoose";

const passwordSchema=mongoose.Schema({
weburl:{
    type:String,
    required: true
},
username:{
    type:String,
    required: true
},
password:{
    type:String,
    required: true
},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
},{timestamps: true})

export const Password=mongoose.model("Password", passwordSchema)
