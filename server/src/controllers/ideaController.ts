import Idea from "../models/idea";
import User from "../models/user";
import axios from "axios";
import { Request, Response } from "express";
import mongoose from "mongoose";

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
  existing_startups?: string[];
  competitors?: string[];
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
                text: `Analyze the following startup idea and return a JSON response with the following keys:
                    - plagiarism_score (number, 0-100)
                    - existing_startups (list of similar startup names)
                    - competitors (list of direct competitors)
    
                    Idea: ${ideaText}
    
                    Respond ONLY in JSON format without explanations.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }
    );

    console.log(
      "Gemini API Raw Response:",
      JSON.stringify(response.data, null, 2)
    );

    let aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) return null;

    // **Fix: Remove markdown code block if present**
    aiResponse = aiResponse.replace(/```json\n?([\s\S]*?)\n?```/, "$1").trim();

    try {
      const parsedData: GeminiAnalysisResult = JSON.parse(aiResponse);
      return parsedData;
    } catch (error) {
      console.warn("Gemini response is not JSON, returning fallback data.");
      return {
        plagiarism_score: "N/A",
        existing_startups: [],
        competitors: [],
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
    const existing_startups = analysisResult?.existing_startups || [];
    const competitors = analysisResult?.competitors || [];

    const newIdea = new Idea({
      title,
      problem,
      solution,
      market,
      monetization,
      industry,
      plagiarism_score,
      existing_startups,
      competitors,
      userId,
    });

    await newIdea.save();

    res.status(201).json({
      success: true,
      message: "Your idea has been successfully submitted!",
      idea: newIdea,
      analysis: {
        plagiarism_score,
        existing_startups,
        competitors,
      },
    });
  } catch (error) {
    console.error("Submit Idea Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
