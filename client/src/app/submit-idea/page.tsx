"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";

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
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    score?: number;
    message: string;
  } | null>(null);

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
      // Here you would integrate with your AI evaluation system
      // Mock API call for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock successful submission
      setSubmitResult({
        success: true,
        score: 85,
        message:
          "Your idea has been evaluated and approved! You now have access to 10 more ideas.",
      });
    } catch (error) {
      setSubmitResult({
        success: false,
        message: `Something went wrong. Please try again. ${error}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-2xl font-bold leading-7 text-gray-900">
                Submit Your Startup Idea
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Fill out the form below to share your startup idea. Our AI will
                evaluate your submission and, if approved, you&apos;ll gain
                access to 10 more ideas.
              </p>
            </div>

            {submitResult ? (
              <div
                className={`px-4 py-5 sm:p-6 ${
                  submitResult.success ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`flex-shrink-0 ${
                      submitResult.success ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {submitResult.success ? (
                      <svg
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <h3
                      className={`text-lg font-medium ${
                        submitResult.success ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {submitResult.success
                        ? "Idea Submitted Successfully"
                        : "Submission Failed"}
                    </h3>
                    <div className="mt-2 text-sm text-gray-700">
                      <p>{submitResult.message}</p>
                      {submitResult.success && (
                        <div className="mt-4">
                          <div className="bg-white shadow overflow-hidden rounded-md p-4 border border-green-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  AI Evaluation Score
                                </p>
                                <p className="text-3xl font-bold text-gray-900">
                                  {submitResult.score}/100
                                </p>
                              </div>
                              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                <svg
                                  className="h-8 w-8 text-green-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 flex">
                            <Link
                              href="/browse-ideas"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Browse Ideas Now
                            </Link>
                            <Link
                              href="/submit-idea"
                              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              onClick={() => setSubmitResult(null)}
                            >
                              Submit Another Idea
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
            )}
          </div>

          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Tips for a Successful Submission
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Follow these guidelines to ensure your idea passes our AI
                evaluation.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <ul className="list-disc pl-5">
                <li>Be clear and concise in your problem statement.</li>
                <li>Provide a detailed solution description.</li>
                <li>Identify your target market accurately.</li>
                <li>Explain your monetization strategy clearly.</li>
                <li>Choose the most relevant industry for your idea.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitIdeaPage;
