import Idea from "../models/idea";
import User from "../models/user";
import axios from "axios";
import { Request, Response } from "express";

import { GEMINI_API_KEY, GEMINI_API_URL } from "../config/constants";
interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

interface GeminiAnalysisResult {
  plagiarism_score?: any;
  uniqueness_score?: any;
  feasibility_score?: any;
  success_score?: any;
  existing_startups?: { name: string; website: string }[];
  competitors?: { name: string; website: string }[];
  business_presence?: Record<string, any>;
  final_score?: string;
}

export const analyzeIdeaWithGemini = async (
  ideaText: string
): Promise<GeminiAnalysisResult | null> => {
  try {
    const response = await axios.post<GeminiResponse>(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Analyze the following startup idea critically and return a JSON response with these fields:
                - first check whether it is an ai generated idea or not use the language submitted to recognize ai text if ai generated reduce the score and increase palgarism.
                - plagiarism_score (number, 0-100): How much of this idea is copied from existing concepts?
                - uniqueness_score (number, 0-100): How original and innovative is this idea?
                - feasibility_score (number, 0-100): How likely is this idea to be implemented successfully?
                - success_score (number, 0-100): Based on competition, innovation, and feasibility, how successful can this idea be?
                - existing_startups (list of similar startup names with their website): Identify startups with a similar concept.
                - competitors (list of direct competitors with their name and website link): List companies/startups that already dominate this space.
                - business_presence (object): A dictionary showing the percentage of similar businesses in different countries (e.g., {"USA": 80, "India": 60, "Germany": 40}).
                - finally based on all the factors provide a final score to the startup idea in percentage considering all the factors.

                Be **harsh** in your assessment. If the idea is weak, give low scores. 

                Idea: ${ideaText}

                Respond **ONLY in JSON format** with no explanations.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 700,
        },
      }
    );

    console.log(
      "Gemini API Raw Response:",
      JSON.stringify(response.data, null, 2)
    );

    let aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) return null;

    // **Fix: Ensure clean JSON output**
    aiResponse = aiResponse.replace(/```json\n?([\s\S]*?)\n?```/, "$1").trim();

    try {
      const parsedData: GeminiAnalysisResult = JSON.parse(aiResponse);
      return parsedData;
    } catch (error) {
      console.warn("Gemini response is not JSON, returning fallback data.");
      return {
        plagiarism_score: "N/A",
        uniqueness_score: "N/A",
        feasibility_score: "N/A",
        success_score: "N/A",
        existing_startups: [],
        competitors: [],
        business_presence: {},
        final_score: ''
      };
    }
  } catch (error: unknown) {
    console.error("API Error:", error);
    return null;
  }
};

export const submitIdea = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, title, problem, solution, market, monetization, industry } =
    req.body;

  try {
    const user = await User.findOne({ supabase_id: userId });
    if (!user) {
      res.status(403).json({ message: "User not found or not authorized" });
      return;
    }

    if (
      !title ||
      !problem ||
      !solution ||
      !market ||
      !monetization ||
      !industry
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const ideaText = `Title: ${title}\nProblem: ${problem}\nSolution: ${solution}\nMarket: ${market}\nMonetization: ${monetization}\nIndustry: ${industry}`;

    // Log request before making the API call
    console.log("Sending request to Gemini:", ideaText);

    const analysisResult = await analyzeIdeaWithGemini(ideaText);

    if (!analysisResult) {
      res.status(500).json({ message: "Error analyzing idea with AI" });
      return;
    }

    console.log("Gemini AI Response:", JSON.stringify(analysisResult, null, 2));

    const plagiarism_score = analysisResult?.plagiarism_score || "N/A";
    const uniqueness_score = analysisResult?.uniqueness_score || "N/A";
    const feasibility_score = analysisResult?.feasibility_score || "N/A";
    const success_score = analysisResult?.success_score || "N/A";
    const existing_startups = analysisResult?.existing_startups || [];
    const competitors = analysisResult?.competitors || [];
    const business_presence = analysisResult?.business_presence || {};
    const final_score = analysisResult?.final_score || ""

    const newIdea = new Idea({
      title,
      problem,
      solution,
      market,
      monetization,
      industry,
      plagiarism_score,
      uniqueness_score,
      feasibility_score,
      success_score,
      existing_startups,
      competitors,
      business_presence,
      final_score,
      userId,
    });

    await newIdea.save();

    res.status(201).json({
      success: true,
      message: "Your idea has been successfully submitted!",
      idea: newIdea,
      analysis: {
        plagiarism_score,
        uniqueness_score,
        feasibility_score,
        success_score,
        existing_startups,
        competitors,
        business_presence,
        final_score
      },
    });
  } catch (error) {
    console.error("Submit Idea Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
