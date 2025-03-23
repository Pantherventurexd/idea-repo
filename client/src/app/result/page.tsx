import React from "react";
import Link from "next/link";

interface ResultScreenProps {
  submitResult: {
    success: boolean;
    score?: number;
    message: string;
  } | null;
  analysis: {
    plagiarism_score: number;
    uniqueness_score: string;
    feasibility_score: string;
    success_score: string;
    existing_startups: { name: string; website: string }[];
    competitors: { name: string; website: string }[];
    final_score: string;
  } | null;
  formData: {
    title: string;
  };
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  submitResult,
  analysis,
  formData,
}) => {
  // Function to calculate color based on score
  const getScoreColor = (score: string | number) => {
    const numScore = typeof score === "string" ? parseInt(score) : score;
    if (numScore >= 80) return "text-green-600";
    if (numScore >= 60) return "text-blue-600";
    if (numScore >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  // Function to get background color for score cards
  const getScoreBgColor = (score: string | number) => {
    const numScore = typeof score === "string" ? parseInt(score) : score;
    if (numScore >= 80) return "bg-green-50 border-green-200";
    if (numScore >= 60) return "bg-blue-50 border-blue-200";
    if (numScore >= 40) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  // Function to render the results screen
  if (!submitResult?.success || !analysis) return null;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-extrabold">Idea Analysis Complete</h2>
            <p className="mt-2 text-indigo-100">
              Our AI has evaluated your startup idea:{" "}
              <span className="font-semibold">{formData.title}</span>
            </p>
          </div>
          <div className="bg-white text-indigo-700 rounded-full h-20 w-20 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold">{analysis.final_score}%</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Score Cards */}
          <div
            className={`rounded-lg border p-4 ${getScoreBgColor(
              analysis.plagiarism_score
            )}`}
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Plagiarism Score
            </h3>
            <div
              className={`text-3xl font-bold ${getScoreColor(
                analysis.plagiarism_score
              )}`}
            >
              {analysis.plagiarism_score}%
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {analysis.plagiarism_score < 30
                ? "Your idea appears original with minimal overlap with existing concepts."
                : "Your idea has some similarities with existing concepts."}
            </p>
          </div>

          <div
            className={`rounded-lg border p-4 ${getScoreBgColor(
              analysis.uniqueness_score
            )}`}
          >
            <h3 className="text-lg font-semibold text-gray-800">Uniqueness</h3>
            <div
              className={`text-3xl font-bold ${getScoreColor(
                analysis.uniqueness_score
              )}`}
            >
              {analysis.uniqueness_score}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              How your idea stands out in the current market.
            </p>
          </div>

          <div
            className={`rounded-lg border p-4 ${getScoreBgColor(
              analysis.feasibility_score
            )}`}
          >
            <h3 className="text-lg font-semibold text-gray-800">Feasibility</h3>
            <div
              className={`text-3xl font-bold ${getScoreColor(
                analysis.feasibility_score
              )}`}
            >
              {analysis.feasibility_score}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              How practical and implementable your idea appears to be.
            </p>
          </div>

          <div
            className={`rounded-lg border p-4 ${getScoreBgColor(
              analysis.success_score
            )}`}
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Success Potential
            </h3>
            <div
              className={`text-3xl font-bold ${getScoreColor(
                analysis.success_score
              )}`}
            >
              {analysis.success_score}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Likelihood of market success based on your described approach.
            </p>
          </div>
        </div>

        {/* Market Analysis */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Market Analysis
          </h3>

          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-700 mb-2">
              Similar Startups
            </h4>
            {analysis.existing_startups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.existing_startups.map((startup, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-md p-3 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-gray-800">{startup.name}</p>
                        <a
                          href={startup.website}
                          className="text-blue-600"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {startup.website}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 italic">
                No similar startups found. This could indicate a unique
                opportunity!
              </p>
            )}
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-2">
              Market Competitors
            </h4>
            {analysis.competitors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.competitors.map((competitor, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-md p-3 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-gray-800">{competitor.name}</p>
                        <a
                          href={competitor.website}
                          className="text-blue-600"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {competitor.website}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 italic">
                No direct competitors identified. This could be a blue ocean
                opportunity!
              </p>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-indigo-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-indigo-800 mb-4">
            What&apos;s Next?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
              <h4 className="font-semibold text-indigo-700 mb-2">
                Access More Ideas
              </h4>
              <p className="text-gray-600 mb-4">
                Your submission has unlocked access to 10 new startup ideas
                curated for your profile.
              </p>
              <Link
                href="/browse-idea"
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition inline-block"
              >
                View Ideas
              </Link>
            </div>
            <div className="flex-1 bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
              <h4 className="font-semibold text-indigo-700 mb-2">
                Refine Your Idea
              </h4>
              <p className="text-gray-600 mb-4">
                Would you like AI assistance to improve and refine your current
                idea?
              </p>
              <button className="bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 py-2 px-4 rounded-md transition">
                Get Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
