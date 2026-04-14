import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";


// const geminiModel = new ChatGoogleGenerativeAI({
//   model: "gemini-2.5-flash-lite",
//   apiKey: process.env.GEMINI_API_KEY,
// });



const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});


const searchInternetTool = tool(
  searchInternet, {
  name: "search_internet",
  description: "Use this tool to search the internet for up-to-date information.",
  schema: z.object({
    query: z.string().describe("The search query to find relevant information on the internet.")
  })
}
)


const agent = createAgent({
  model: mistralModel,
  tools: [searchInternetTool],

})





export async function generateResponse(messages) {
  console.log(messages)

  const response = await agent.invoke({
    messages: [
      new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know. 
                If the question requires up-to-date information, use the "searchInternet" tool to get the latest information from the internet and then answer based on the search results.
            `),
      ...(messages.map(msg => {
        const role = msg.role?.toLowerCase();

        if (role === "user") {
          return new HumanMessage(msg.content);
        } else if (role === "assistant") {
          return new AIMessage(msg.content);
        }

        return null; 
      })
        .filter(Boolean) 
      )]
  });

  return response.messages[response.messages.length - 1].text;

}



export async function generateTitle(message) {

  const response = await mistralModel.invoke([
    new SystemMessage("You are a helpful assistant that generates concise and relevant titles for user queries. Generate a short 3-4 word title for the user's message. Keep it meaningful, directly related, and easy to understand. Avoid filler words."),
    new HumanMessage(`Generate a concise title for the following message: ${message}`)
  ]);
  return response.text;


}
