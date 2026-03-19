const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
dotenv = require('dotenv');
dotenv.config();

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
})


const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).min(3).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).min(3).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).min(1).describe("List of skill gaps in the candidate's profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).min(3).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})


async function generateInterviewReport({resume, selfDescription, jobDescription}) {

   try {

    const normalizeReport = (report) => {
        const normalized = { ...report }

        if (typeof normalized.skillGaps === "string") {
            normalized.skillGaps = [ { skill: normalized.skillGaps, severity: "medium" } ]
        }

        if (typeof normalized.preparationPlan === "string") {
            const focus = normalized.preparationPlan
            normalized.preparationPlan = [
                { day: 1, focus, tasks: [ "Review fundamentals" ] },
                { day: 2, focus, tasks: [ "Practice interview questions" ] },
                { day: 3, focus, tasks: [ "Mock interview and recap" ] }
            ]
        }

        return normalized
    }

    const prompt = `Generate an interview report in JSON format for a candidate with the following details.

Requirements:
- Provide at least 3 technical questions.
- Provide at least 3 behavioral questions.
- Provide at least 1 skill gap with severity (low/medium/high).
- Provide a 3-day preparation plan with at least 2 tasks per day.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

   const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    const parsed = normalizeReport(JSON.parse(response.text))
    const validation = interviewReportSchema.safeParse(parsed)

    if (!validation.success) {
        const issues = validation.error.issues.map((issue) => issue.message).join("; ")
        throw new Error(`AI response did not match the required schema: ${issues}`)
    }

    return validation.data

       
    } catch (error) {
        if (error.status === 503) {
            throw new Error("AI service is temporarily unavailable due to high demand. Please try again later.");
        }
        throw error;
    }
}


module.exports = {generateInterviewReport};
