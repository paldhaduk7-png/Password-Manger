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
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
},{timestamps: true})

passwordSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days


export const Password=mongoose.model("Password", passwordSchema)
