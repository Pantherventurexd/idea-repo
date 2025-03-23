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

interface SimilarIdea {
  title: string;
  problem: string;
  solution: string;
  market: string;
  monetization: string;
  industry: string;
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
        final_score: "",
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
    const final_score = analysisResult?.final_score || "";

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
        final_score,
      },
    });
  } catch (error) {
    console.error("Submit Idea Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getIdeas = async (req: Request, res: Response): Promise<void> => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });

    // Transform the data to match the frontend's expected format
    const formattedIdeas = ideas.map((idea) => ({
      id: idea._id,
      title: idea.title,
      problem: idea.problem,
      solution: idea.solution,
      industry: idea.industry,
      creator: idea.userId, 
      likes: 0, 
      comments: 0,
    }));

    res.status(200).json({
      success: true,
      ideas: formattedIdeas,
    });
  } catch (error) {
    console.error("Get Ideas Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getSimilarIdeas = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, problem, solution, market, monetization, industry } = req.body;

  if (!title || !problem || !solution || !market || !monetization || !industry) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  try {
    const ideaText = `Title: ${title}\nProblem: ${problem}\nSolution: ${solution}\nMarket: ${market}\nMonetization: ${monetization}\nIndustry: ${industry}`;

    const response = await axios.post<GeminiResponse>(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Generate 3 similar but innovative startup ideas based on this input:
                ${ideaText}

                For each idea, provide:
                - A unique and catchy title
                - A detailed problem description (200-300 characters) that clearly explains the pain point
                - A comprehensive solution (300-400 characters) that addresses the problem
                - A specific target market description
                - A clear monetization strategy with 2-3 revenue streams
                - A relevant industry category

                Return ONLY a raw JSON array with exactly 3 objects. Each object must have these properties: 
                title, problem, solution, market, monetization, and industry.
                
                Focus on depth and quality rather than quantity. Make each idea detailed and well-thought-out.
                
                Return the response as a clean JSON array without any markdown or formatting.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 2048,
        },
      }
    );

    let aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      res.status(500).json({ message: "Failed to generate similar ideas" });
      return;
    }

    try {
      console.log('Raw AI Response:', aiResponse);
      
      aiResponse = aiResponse
        .replace(/^```json\s*/g, '')
        .replace(/```\s*$/g, '')
        .replace(/^\s*\[\s*/, '[')
        .replace(/\s*\]\s*$/, ']')
        .trim();
      
      console.log('Cleaned AI Response:', aiResponse);

      const similarIdeas: SimilarIdea[] = JSON.parse(aiResponse);
      
      if (!Array.isArray(similarIdeas) || similarIdeas.length !== 3) {
        throw new Error('Invalid response format or incorrect number of ideas');
      }

      res.status(200).json({
        success: true,
        similarIdeas,
      });
    } catch (error) {
      console.error('JSON Parse Error:', error);
      console.error('AI Response that failed to parse:', aiResponse);
      res.status(500).json({ 
        message: "Failed to parse AI response",
        details: error instanceof Error ? error.message : 'Unknown error',
        rawResponse: aiResponse.substring(0, 500)
      });
    }
  } catch (error) {
    console.error("Generate Similar Ideas Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getDetailsFromIdea = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { sentence } = req.body;

  if (!sentence) {
    res.status(400).json({ message: "Sentence is required" });
    return;
  }

  const validIndustries = [
    "technology",
    "health",
    "finance",
    "education",
    "ecommerce",
    "sustainability",
    "food",
    "travel"
  ];

  try {
    const response = await axios.post<GeminiResponse>(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Given this sentence about a startup idea: "${sentence}"

                Generate a detailed startup idea breakdown with the following components:
                - A catchy title (max 50 characters)
                - A clear problem statement (200-300 characters)
                - An innovative solution (300-400 characters)
                - A well-defined target market description (100-200 characters)
                - A specific monetization strategy with 2-3 revenue streams (200-300 characters)
                - An industry category (MUST be one of these exact values: technology, health, finance, education, ecommerce, sustainability, food, travel)

                Return ONLY a JSON object with these properties: title, problem, solution, market, monetization, and industry.
                Make sure the industry exactly matches one from the list provided.
                
                Return the response as a clean JSON object without any markdown or formatting.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }
    );

    let aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      res.status(500).json({ message: "Failed to generate idea details" });
      return;
    }

    try {
      aiResponse = aiResponse
        .replace(/```json\s*/g, '')
        .replace(/```\s*$/g, '')
        .trim();

      const ideaDetails = JSON.parse(aiResponse);

      // Validate that all required fields are present
      const requiredFields = ['title', 'problem', 'solution', 'market', 'monetization', 'industry'];
      const missingFields = requiredFields.filter(field => !ideaDetails[field]);

      if (missingFields.length > 0) {
        res.status(500).json({ 
          message: "Generated response is missing required fields",
          missingFields 
        });
        return;
      }

      // Validate that the industry is one of the valid options
      if (!validIndustries.includes(ideaDetails.industry.toLowerCase())) {
        ideaDetails.industry = "technology"; // Default to technology if invalid
      }

      res.status(200).json({
        success: true,
        ideaDetails
      });
    } catch (error) {
      console.error('JSON Parse Error:', error);
      res.status(500).json({ 
        message: "Failed to parse AI response",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } catch (error) {
    console.error("Generate Idea Details Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};