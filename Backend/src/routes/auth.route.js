import { Router } from "express";
import { loginValidator, registerValidator,emailValidator} from "../validators/auth.validator.js";
import { getMe, login, register, verifyEmail,resendVerificationEmail } from "../controller/auth.controller.js";
import { identifyUser } from "../middleware/auth.middleware.js";
const authRouter=Router();

authRouter.post("/register",registerValidator,register)
authRouter.post("/login",loginValidator,login)
authRouter.get("/get-me",identifyUser,getMe)
authRouter.post("/resend-verification-email",emailValidator,resendVerificationEmail);
authRouter.get("/verify-email",verifyEmail)
export default authRouter;