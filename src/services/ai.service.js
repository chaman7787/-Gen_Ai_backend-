const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const dotenv = require("dotenv")
dotenv.config()

// ✅ Step 2 — Now API key is available
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Generate EXACTLY 8 technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Generate EXACTLY 5 behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap")
    })).describe("Generate at least 5 skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan"),
        tasks: z.array(z.string()).describe("List of 3-5 tasks to be done on this day")
    })).describe("Generate a complete 7-day preparation plan for the candidate"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
You are an expert technical interviewer and career coach.

Generate a COMPLETE interview report for the candidate below.

STRICT RULES:
- technicalQuestions: EXACTLY 8 questions
- behavioralQuestions: EXACTLY 5 questions  
- skillGaps: at least 5 gaps
- preparationPlan: EXACTLY 7 days (day 1 to day 7), each with 3-5 tasks
- Do NOT leave any array empty

=== RESUME ===
${resume}

=== SELF DESCRIPTION ===
${selfDescription}

=== JOB DESCRIPTION ===
${jobDescription}
`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",   // ✅ Fixed model name
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
            temperature: 0.7,
            maxOutputTokens: 8192,
        }
    })

    return JSON.parse(response.text)
}

module.exports = generateInterviewReport;
module.exports.generateInterviewReport = generateInterviewReport;