import { ChatGoogle } from "@langchain/google/node";

const model = new ChatGoogle({
  model: "gemini-3.7-flash",
  apiKey: process.env.GEMINI_API_KEY
});
export async function testAi(){
    model.invoke("What is Capital of India?").then((response)=>{
        console.log(response.text);
    })
}