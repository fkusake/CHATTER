import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


const aiConfig = ()=>{
  const aiModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0,
  apiKey:`${process.env.GOOGLE_API_KEY}`
});
return aiModel;
}


export default aiConfig;