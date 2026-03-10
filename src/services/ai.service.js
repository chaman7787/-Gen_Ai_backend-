const {GoogleGenAI} = require("@google/genai");
dotenv = require('dotenv');
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
    
});


async function invokeGeminiAi(){
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hello Gemini ! Explain what is interview?",
    });

    console.log(response.text);
}


module.exports = { invokeGeminiAi };
