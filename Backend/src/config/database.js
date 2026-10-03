import mongoose from "mongoose";
export async function connectedToDb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to Db");
    })
}
