import axios from "axios";
// Layer 1: send chat requests to the existing backend endpoint.
export const api=axios.create({
    baseURL:"http://localhost:3001",
    withCredentials:true
})

// Send the message and the active chat id, if this is an existing conversation.
export async function sendMessage({message,chatId}){
   const response=await api.post("/api/chats/message",{message,chat:chatId});
   return response.data;
} 
export async function getChats(){
    const response=await api.get("/api/chats/");
    return response.data;
}
export async function getMessages({chatId}){
    const response=await api.get(`/api/chats/${chatId}/messages`,{chatId});
    return response.data;
}
export async function deleteChat({chatId}){
    const response=await api.delete(`/api/chats/delete/${chatId}`,{chatId});
    return response.data
}