import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
export async function register(req,res,next){
      const {username,email,password}=req.body;
    const isUserAlreadyExists=await userModel.findOne({
        $or:[{username},{email}]
    })
    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"User with this email or username already exists",
            success:false,
            err:"User already exists"
        })
    }
    const user=await userModel.create({username,email,password});
    await sendEmail({
        to:email,
        subject:"Welcome to NEXORA",
        html:`
               <p>Hi ${username}</p>
                <p>Thank you for registering at NEXORA.We're excited to have you on board!</p>
                 <p>Best regards,<br>The NEXORA Team</p>`
    })
    res.status(200).json({
        message:"User registered Successfully",
        success:true,
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}