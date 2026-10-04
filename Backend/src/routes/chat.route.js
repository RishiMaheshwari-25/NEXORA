import {Router} from "express";
import { sendMessage } from "../controller/chat.controller.js";
import { identifyUser } from "../middleware/auth.middleware.js";
import {getChats,getMessages} from "../controller/chat.controller.js"
const chatRouter=Router();
chatRouter.post("/message",identifyUser,sendMessage);
chatRouter.get("/",identifyUser,getChats)
chatRouter.get("/:chatId/messages",identifyUser,getMessages)
chatRouter.delete("/delete/:chatId/",identifyUser)

export default chatRouter;
