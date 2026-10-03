import userModel from "../models/user.model.js";
import { sendEmail } from "../services/mail.service.js";
import  jwt  from "jsonwebtoken";
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
    const emailVerificationToken=jwt.sign({
        email:user.email
    },process.env.JWT_SECRET)
    await sendEmail({
        to:email,
        subject:"Welcome to NEXORA",
        html:`
               <p>Hi ${username}</p>
                <p>Thank you for registering at <strong>NEXORA</strong>.We're excited to have you on board!</p>
                 <p>Please verify your email address by clicking the link below:</p>
                 <a href="http://localhost:3001/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
                 
                 <p>If you did not receive the verification email, you can request a new one by clicking the link below:</p>
                 <a href="http://localhost:3001/api/auth/resend-verification-email?token=${emailVerificationToken}">Resend Verification Email</a>
                  <p>If you did not create an account, please ignore this email.</p>
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
export async function login(req,res){
    const {email,password}=req.body
  const user=await userModel.findOne({email})
  if(!user){
    return res.status(400).json({
        message:"Invalid Credentials",
        success:false,
        err:"User not found"
    })
  }
  const isPasswordMatch=await user.comparePassword(password);
  if(!isPasswordMatch){
    return res.status(400).json({
        message:"Invalid email or Password",
        success:false,
        err:"Incorrect Password"
    })
  }
  if(!user.verified){
    return res.status(400).json({
        message:"Please verify your email before logging in",
        success:false,
        err:"User is not verified"
    })
  }
  const token=jwt.sign({
    id:user._id,
    username:user.username
  },process.env.JWT_SECRET,{expiresIn:"7d"})
  res.cookie("token",token)
  res.status(200).json({
    message:"User loggedin Successfully",
    success:true,
    user:{
        id:user._id,
        username:user.username,
        email:user.email
    }
  })
}
export async function getMe(req,res){
    const userId=req.user.id;
    const user=await userModel.findById(userId).select("-password");
    if(!user){
        return res.status(400).json({
            message:"User not found",
            success:false,
            err:"User not found"
        })
    }
    res.status(200).json({
        message:"User details fetched Successfully",
        success:true,
        user
    })
}
export async function verifyEmail(req,res){
    const {token}=req.query;
    try{const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const user=await userModel.findOne({email:decoded.email})
    if(!user){
        return res.status(400).json({
            message:"Invalid token",
            success:false,
            err:"User not found"
        })
    }
    user.verified=true;
    await user.save();
      const html=`
                 <h1>Email Verified Successfully!</h1>
                 <p>Your email has been verified.You can now login into your account <br>
                 <a href="http://localhost:3001/login">Go to Login</a>`
         return res.send(html);
        }catch(err){
            return res.status(400).json({
            message:"Invalid or Expired token",
            success:false,
            err:err.message
        })
        }
        
}
export async function resendVerificationEmail(req,res){
    try{const email=req.body.email;
    const user=await userModel.findOne({email});
    if(!user || user.verified){
        return res.status(400).json({
            message:"Invalid request",
            success:false,
            err:"User not found or already verified"
        })
    }
    const emailVerificationToken=jwt.sign({
        email:user.email
    },process.env.JWT_SECRET,{expiresIn:"15m"})
    const verificationUrl=`http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}`;
    await sendEmail({
        to:user.email,
        subject:"Resend Email Verification",
        html:`
               <p>Hi ${user.username}</p>
                <p>We received a request to resend the email verification for your account at <strong>NEXORA</strong>.</p>
                <a href="${verificationUrl}">Verify Email</a>
                <p>This verification link expires in 15 minutes.</p>`
    })
    return res.status(200).json({
        message:"Verification email resent successfully", 
        success:true,
        verificationUrl
    })
}catch(err){
    return res.status(500).json({
        message:"Error resending verification email",
        success:false,
        err:err.message
    })
}
}
