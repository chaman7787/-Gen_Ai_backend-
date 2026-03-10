const {GoogleGenAI} = require("@google/genai");
const {z} = require("zod");
const {zodToJsonSchema} = require("zod-to-json-schema");
dotenv = require('dotenv');
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
    
});

const interviewSchemaReport = z.object({
    matchScore: z.number().describe("A score from 0 to 100 indicating how well the candidate's resume and self-description match the job description."),
    candidateName: z.string().describe("The name of the candidate extracted from the resume."),
    jobTitle: z.string().describe("The job title from the job description."),
   skillGaps: z.array(z.object({
        skill: z.string().describe("The specific skill gap identified."),
        relevance: z.string().describe("How relevant this skill is (Required/Bonus Point)."),
        mitigation: z.string().describe("How to address or mitigate this skill gap."),
    })).describe("An array of identified skill gaps with mitigation strategies."),
    technicalQuestions: z.array(z.string()).describe("An array of technical interview questions the candidate should prepare for."),
    behavioralQuestions: z.array(z.string()).describe("An array of behavioral interview questions the candidate should prepare for."),
    preparationPlan: z.array(z.string()).describe("An array of preparation steps/strategies for the interview.")
});


async function generateInterviewReport({resume, selfDescription, jobDescription}) {
   try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config:{
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewSchemaReport, {$refStrategy: "none"}),
            }
        });

        console.log(JSON.parse(response.text));
        return JSON.parse(response.text);
    } catch (error) {
        if (error.status === 503) {
            throw new Error("AI service is temporarily unavailable due to high demand. Please try again later.");
        }
        throw error;
    }
}


module.exports = {generateInterviewReport};
