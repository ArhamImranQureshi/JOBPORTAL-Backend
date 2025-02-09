import {User} from '../models/user.models.js';
import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';

export const register = async(req,res)=>{
    try{
        const {fullname, email, phoneNumber, password, role} = req.body;
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.stats(400).json({
                message:"Something is missing",
                success:false,
            })
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"User already exists",
                success:false,
            })
        }
        const hashedPassword = await bycrypt.hash(password,12);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role
        })
        return res.status(201).json({
            message:"User created successfully",
            success:true,
        })
    } catch (err){
        console.log(err);
    } 
}

export const login = async (req,res)=>{
    try{
        const {email,password,role} = req.body;
        if(!email || !password || !role){
            res.status(400).json({
                message:"Incorrect credentials",
                success:false,
            })
        }
        let user = await User.findOne({email});
        if(!user) return res.status(400).json({
            message:"User not found",
            success:false,
        })
        const ispasswordMatch = await bycrypt.compare(password, user.password);
        if(!ispasswordMatch) return res.status(400).json({
            message:"Invalid credentials",
            success:false,
        })

        if(role!== user.role){
            return res.status(400).json({
                message:"Account doesn't exist with current role",
                success:false,
            })
        }
        const tokenData = {
            userId:user._id,
        }
        const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'})
        user = {
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile,
        }
        return res.status(200).cookie("token", token,{maxAge:60000*60*24*1,httpOnly:true,sameSite:"strict"}).json({
            message:`Welcome Back ${user.fullname}`,
            user,
            success:true,
        });

    } catch(err){
        console.log(err)
    }
}

export const logout = async(req,res)=>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out successfully",
            success:true,
        })
    } catch(err){
        console.log(err)
    }

}
/////////// Updating profile is not working
export const updateProfile = async(req,res)=>{
    try{
        const {fullname, email, phoneNumber, bio, skills} = req.body;
        const file = req.file;
        ///// cloudinary is implimented
        const fileUri = getDataUri(file);
        const cloudResponce = await cloudinary.uploader.upload(fileUri.content);




        if(!fullname || !email || !phoneNumber || !skills || !bio ){
            return res.status(400).json({
                message:"Something is missing",
                success:false,
            });
        };





        const skillArray = skills? skills.split(","):[];
        const userId = req.id;
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                message:"User not found",
                success:false,
            })
        }

        if(fullname) user.fullname = fullname;
        if(email) user.email=email;
        if(phoneNumber) user.phoneNumber= phoneNumber;
        if(bio) user.profile.bio = bio;
        if(skills) user.profile.skills =skillArray;
        
        // this will save the cloudairy url to the user profile
        if(cloudResponce){
            user.profile.resume = cloudResponce.secure_url;
            user.profile.resumeOriginalName = file.originalname /// to show the originname of the file

        }
        await user.save();
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile,
        }

        return res.status(200).json({
            message:"Profile updated successfully",
            user,
            success:true,
        })

    } catch(err){
        console.log(err)
    }
}