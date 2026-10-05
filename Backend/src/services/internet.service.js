import {tavily as Tavily} from "@tavily/core";
const tavily = Tavily(
    { apiKey: process.env.TAVLIY_API_KEY }
);
export const searchInternet=async({query})=>{
    const results=await tavily.search(query,{
        maxResults:5,
        searchDepth:"advanced"
    })
    return JSON.stringify(results)
}