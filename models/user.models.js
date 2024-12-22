import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    phoneNumber:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['student','recruiter'],
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String},
        resumeOriginalName:{type:String},
        compony:{type:mongoose.Schema.Types.ObjectId, ref:'Compony'},
        profilePhoto:{
            type:String,
            default:"",
        }
    }
},{timestamps:true});
export const User = mongoose.model('User',userSchema);