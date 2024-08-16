import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req,res) => {
    try {
        const {fullname, email, phoneNumber, password, role} = req.body;
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        };
        let user = await User.findOne({email}); //using let to use this user variable again 
        if(user){
            return res.status(400).json({
                message:"User already exist with this email Id",
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname, 
            email, 
            phoneNumber, 
            password:hashedPassword, 
            role,
        })

        return res.status(200).json({
            message: "Account created successfully.",
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req,res) =>{
    try {
        const {email, password, role} = req.body;
        if(!email || !password || !role){
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        };
        
        let user = await User.findOne({email}); //email checking
        if(!user){
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            })
        };
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);  //password checking
        if(!isPasswordMatch){
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            })
        };
        
        if(role != user.role){
            return res.status(400).json({
                message:"Account doesn't exist eith current role",
                success:false,
            })
        };

        const tokenData = {
            userId:user._id
        }

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY,{expiresIn: '1d'});

        user = {
            _id:user._id,
            fullname:user.fullname,
            email: user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }

        return res.status(200).cookie("token", token, {maxAge: 1*24*60*60*1000, httpsOnly:true, sameSite:'strict'}).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success:true,
        })
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req,res) => {
     try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message:"Logged out successfully.",
            success: true,
        })
     } catch (error) {
        console.log("error");
     }
}

export const updateProfile = async (req,res) =>{
    try {
        const {fullname, email, phoneNumber, bio, skills} = req.body;
        const file = req.file;  
        
        let skillsArray;
        if(skills){
            skillsArray = skills.split(","); // splitting with ,
        }
        const userId = req.id; //From Middleware Authentication
        let user = await User.findById(userId);
        
//DATA UPDATING
        if(fullname) user.fullname = fullname;
        if(email) user.email = email;
        if(phoneNumber) user.phoneNumber = phoneNumber;
        if(bio) user.profile.bio = bio;
        if(skills) user.profile.skills = skillsArray;        
        
//RESUME COMES LATER
        await user.save();

        user = {
            _id:user._id,
            fullname:user.fullname,
            email: user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully",
            user,
            success:true,
        })

    } catch (error) {
        console.log(error);
    }
}

// export const getAllUsers = async (req, res) => {
//     let users;
//     try{
//         users = await User.find();
//     }catch(err){
//        console.log(err);
//     }
    
//     if(!users){
//         return res.status(404).json({message:'NO user found'});
//     }

//     return res.status(200).json({users});
// };
