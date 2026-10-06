import { io } from "socket.io-client";
const apiUrl=import.meta.env.VITE_API_URL || "http://localhost:3001";
export const initializeSocketConnection = () => {
    const socket = io(apiUrl,{
        withCredentials:true,
    })
    socket.on("connect",()=>{
        console.log("Connected to socket server");
    });
    
}