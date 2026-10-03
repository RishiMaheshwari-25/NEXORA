import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import morgan from "morgan";
import cors from "cors";
const app=express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"]
}))

app.use(express.json())
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth",authRouter);

export default app;