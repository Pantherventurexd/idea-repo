import { Request, Response } from "express";
import axios from "axios";
import { GEMINI_API_KEY, GEMINI_API_URL } from "../config/constants";

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

interface SimilarIdea {
  title: string;
  problem: string;
  solution: string;
  market: string;
  monetization: string;
  industry: string;
}

export const createIdea = async (req: Request, res: Response) => {
  const { title, problem, solution, market, monetization, industry } = req.body;
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
          maxOutputTokens: 2048,     // Increased token limit
        },
      }
    );

    let aiResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      res.status(500).json({ message: "Failed to generate similar ideas" });
      return;
    }

    try {
      // First log the raw response
      console.log('Raw AI Response:', aiResponse);
      
      // More robust cleanup of the response
      aiResponse = aiResponse
        .replace(/^```json\s*/g, '')    // Remove opening ```json
        .replace(/```\s*$/g, '')        // Remove closing ```
        .replace(/^\s*\[\s*/, '[')      // Clean up start of array
        .replace(/\s*\]\s*$/, ']')      // Clean up end of array
        .trim();
      
      console.log('Cleaned AI Response:', aiResponse);

      const similarIdeas: SimilarIdea[] = JSON.parse(aiResponse);
      
      // Validate the response
      if (!Array.isArray(similarIdeas) || similarIdeas.length !== 3) {
        throw new Error('Invalid response format or incorrect number of ideas');
      }

      res.status(200).json({
        success: true,
        similarIdeas,
      });
    } catch (error) {
      // Add more detailed error logging
      console.error('JSON Parse Error:', error);
      console.error('AI Response that failed to parse:', aiResponse);
      res.status(500).json({ 
        message: "Failed to parse AI response",
        details: error instanceof Error ? error.message : 'Unknown error',
        rawResponse: aiResponse.substring(0, 500) // Only include first 500 chars for debugging
      });
    }
  } catch (error) {
    console.error("Generate Similar Ideas Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
