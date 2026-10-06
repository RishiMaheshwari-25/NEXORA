import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import morgan from "morgan";
import cors from "cors";
import chatRouter from "./routes/chat.route.js"
const app=express();
app.use(cors({
    origin:process.env.FRONTEND_URL || "http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"]
}))

app.use(express.json())
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/health",(req,res)=>{
    res.status(200).json({status:"ok"});
})

app.use("/api/auth",authRouter);
app.use("/api/chats",chatRouter)

export default app;