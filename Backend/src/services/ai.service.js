import { ChatGoogle } from "@langchain/google/node";
import {HumanMessage,SystemMessage,AIMessage} from "langchain"

import { ChatGroq } from "@langchain/groq";
// const geminiModel = new ChatGoogle({
//   model: "gemini-3.7-flash",
//   apiKey: process.env.GEMINI_API_KEY
// });
const grokModel = new ChatGroq({
    model: "openai/gpt-oss-20b",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.7,
});
const titleModel = new ChatGoogle({
    model: "gemini-3.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
});
 export async function generateResponse(messages){
   const response=await grokModel.invoke(messages.map(msg=>{
   if(msg.role=="user"){
    return new HumanMessage(msg.content)
   }
   else if(msg.role=="ai"){
    return new AIMessage(msg.content)
   }
   }))
   return response.text
 }
 export async function generateChatTitle(message){
  const response=await titleModel.invoke([
 new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
            User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.    
        `),
  new HumanMessage(`
            Generate a title for a chat conversation based on the following first message:
            "${message}"
            `)
  ])
  return response.text;
 }