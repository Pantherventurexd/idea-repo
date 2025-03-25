"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import ResultScreen from "../result/page";

const SubmitIdeaPage: React.FC = () => {
  const [formData, setFormData] = useState<{
    title: string;
    problem: string;
    solution: string;
    market: string;
    monetization: string;
    industry: string;
  }>({
    title: "",
    problem: "",
    solution: "",
    market: "",
    monetization: "",
    industry: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [analysis, setAnalysis] = useState<{
    plagiarism_score: number;
    uniqueness_score: string;
    feasibility_score: string;
    success_score: string;
    existing_startups: { name: string; website: string }[];
    competitors: { name: string; website: string }[];
    business_presence: {};
    final_score: ''
  } | null>(null);

  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    score?: number;
    message: string;
  } | null>(null);

  const [redirecting, setRedirecting] = useState(false);
  const { user, isAuthenticated, setUserIdeaId, initializeUserIdeaId } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      setRedirecting(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="text-center">
          <p className="text-xl font-medium">
            {redirecting
              ? "You must be logged in to submit an idea. Redirecting to login..."
              : "Redirecting..."}
          </p>
          <p className="text-gray-500">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:7000/api/ideas/submit-idea",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user?.id,
            ...formData,
          }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setUserIdeaId(result.idea._id);
        initializeUserIdeaId();
        console.log(result.idea._id);
      }

      if (result.success) {
        setSubmitResult({
          success: true,
          score: result.score,
          message: result.message,
        });
        setAnalysis(result.analysis);
      } else {
        setSubmitResult({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: `Something went wrong. Please try again. ${error}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      alert("Please enter your idea description first!");
      return;
    }

    setIsLoadingAI(true);
    try {
      const response = await fetch("http://localhost:7000/api/ideas/get-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sentence: aiPrompt,
        }),
      });

      const data = await response.json();
      if (data.success && data.ideaDetails) {
        setFormData({
          title: data.ideaDetails.title,
          problem: data.ideaDetails.problem,
          solution: data.ideaDetails.solution,
          market: data.ideaDetails.market,
          monetization: data.ideaDetails.monetization,
          industry: data.ideaDetails.industry,
        });
      }
    } catch (error) {
      alert("Failed to generate idea details. Please try again.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const renderResultScreen = () => {
    return (
      <ResultScreen
        submitResult={submitResult}
        analysis={analysis}
        formData={formData}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {submitResult ? (
            renderResultScreen()
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-2xl font-bold leading-7 text-gray-900">
                  Submit Your Startup Idea
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Fill out the form below to share your startup idea. Our AI
                  will evaluate your submission and, if approved, you&apos;ll
                  gain access to 10 more ideas.
                </p>
              </div>

              {/* AI Form Filling Section */}
              <div className="px-4 py-5 bg-gray-50 sm:p-6 border-b border-gray-200">
                <div className="mb-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Use our AI to help fill the form
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Describe your idea in a detail and let our AI help you structure it.
                  </p>
                  <div className="mt-2">
                    <div className="relative">
                      <textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
                        placeholder="Describe your startup idea here..."
                        rows={3}
                      />
                      <div className="mt-3">
                        <p className="text-sm text-amber-600">
                          ⚠️ Warning: Your idea should be unique as our AI will check for its authenticity. Please modify the generated content to make it truly yours.
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={handleAIGenerate}
                        disabled={isLoadingAI}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {isLoadingAI ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Generating...
                          </>
                        ) : (
                          "Generate with AI"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="border-t border-gray-200"
              >
                <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Idea Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3"
                        placeholder="A brief title for your startup idea"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="problem"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Problem Statement
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="problem"
                        name="problem"
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
                        placeholder="What problem does your idea solve? Be specific."
                        value={formData.problem}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Clearly define the problem your idea is addressing.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="solution"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Solution Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="solution"
                        name="solution"
                        rows={3}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
                        placeholder="How does your idea solve this problem?"
                        value={formData.solution}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="market"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Target Market
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="market"
                        id="market"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3"
                        placeholder="Who are your target customers?"
                        value={formData.market}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="monetization"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Monetization Strategy
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="monetization"
                        id="monetization"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3"
                        placeholder="How will your idea make money?"
                        value={formData.monetization}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="industry"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Industry
                    </label>
                    <div className="mt-1">
                      <select
                        id="industry"
                        name="industry"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select an industry</option>
                        <option value="technology">Technology</option>
                        <option value="health">Healthcare</option>
                        <option value="finance">Finance</option>
                        <option value="education">Education</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="sustainability">Sustainability</option>
                        <option value="food">Food & Beverage</option>
                        <option value="travel">Travel & Hospitality</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      "Submit Idea"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmitIdeaPage;
