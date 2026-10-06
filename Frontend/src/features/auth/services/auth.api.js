import axios from 'axios';
const apiUrl=import.meta.env.VITE_API_URL || "http://localhost:3001";
const api=axios.create({
    baseURL:apiUrl,
    withCredentials:true
})
export async function login({email,password}){
    const response=await api.post( "/api/auth/login",{email,password});
    return response.data
}
export async function register({username,email,password}){
    const response=await api.post("/api/auth/register",{username,email,password});
    return response.data;
}

export async function getMe(){
    const response=await api.get("/api/auth/get-me");
    return response.data;
}
export async function resendVerificationEmail({email}){
    const response=await api.post("/api/auth/resend-verification-email",{email});
    return response.data;
}