import {generateResponse,generateChatTitle} from "../services/ai.service.js"
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"


export async function sendMessage(req,res){
    const {message,chat:chatID}=req.body;
   
   let chat=null;
   let title=null;
    if(!chatID){
     title=await generateChatTitle(message);
    console.log(title)
   
    chat=await chatModel.create({
        user:req.user.id,
        title
    })
    }
    const usermessage=await messageModel.create({
      chat:chatID || chat._id,
      content:message,
      role:"user"
    })
    const messages=await messageModel.find({chat:chatID || chat._id})
        
   
   const result=await generateResponse(messages);
    const aimessages=await messageModel.create({
        chat:chatID || chat._id,
        content:result,
        role:"ai"
    })
    console.log(messages);
    res.status(200).json({
        title,
       chat,
       AImessage:result,
       
       aimessages
    })

    
}
export async function getChats(req,res){
    const user=req.user;
    const chats=await chatModel.find({user:user.id})
    res.status(200).json({
        message:"All chats fetched successfully",
        chats
    })
}
export async function getMessages(req,res){
    const {chatId}=req.params;
    const chat=await chatModel.find({
        id:chatId,
        user:req.user.id
    })
    if(!chat){
        return res.status(404).json({
            message:"Chat not found",

        })
    }
    const messages=await messageModel.find({chat:chatId})
    res.status(200).json({
        message:"Message retrieved successfully",
        messages
    })
}
export async function deleteChat(req,res){
    const {chatId}=req.params;
    const chat=await chatModel.findOneAndDelete({
        id:chatId,
        user:req.user.id
    })
    await messageModel.deleteMany({
        chat:chatId
    })
    if(!chat){
        return res.status(404).json({
            message:"Chat not found"
        })
    }
    res.status(200).json({
        message:"chat deleted successfully"
    })
}