"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, PanInfo } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
// Define the type for an Idea
interface Idea {
  id: number;
  title: string;
  problem: string;
  solution: string;
  industry: string;
  creator: string;
  createdAt: string;
  likes: number;
  comments: number;
}

const BrowseIdeasPage: React.FC = () => {
  const { user, userIdeaId } = useAuthStore();
  // Replace the useState initialization with an empty array
  const [ideas, setIdeas] = useState<Idea[]>([]);

  // Add a loading state
  const [loading, setLoading] = useState<boolean>(true);

  // Add this useEffect to fetch ideas when the component mounts
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:7000/api/ideas/get-ideas`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            }
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch ideas");
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.ideas)) {
          setIdeas(data.ideas);
        } else {
          console.error("Invalid response format:", data);
        }
      } catch (error) {
        console.error("Error fetching ideas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>(ideas);
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("newest");

  // New state for Bumble-style swiping
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [bucketList, setBucketList] = useState<Idea[]>([]);
  const [showBucketList, setShowBucketList] = useState<boolean>(false);
  const [direction, setDirection] = useState<string>("");
  const cardRef = useRef<HTMLDivElement>(null);

  const [filtersVisible, setFiltersVisible] = useState<boolean>(false);

  // Filter and sort ideas based on user selections
  useEffect(() => {
    let result = [...ideas];

    // Filter by industry
    if (selectedIndustry !== "all") {
      result = result.filter((idea) => idea.industry === selectedIndustry);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (idea) =>
          idea.title.toLowerCase().includes(term) ||
          idea.problem.toLowerCase().includes(term) ||
          idea.solution.toLowerCase().includes(term)
      );
    }

    // Sort ideas
    switch (sortBy) {
      case "newest":
        result.sort((a: Idea, b: Idea) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        break;
      case "mostLiked":
        result.sort((a: Idea, b: Idea) => b.likes - a.likes);
        break;
      case "mostDiscussed":
        result.sort((a: Idea, b: Idea) => b.comments - a.comments);
        break;
      default:
        break;
    }

    setFilteredIdeas(result);
  }, [selectedIndustry, searchTerm, sortBy, ideas]);

  const handleLike = (ideaId: number) => {
    setIdeas(
      ideas.map((idea) =>
        idea.id === ideaId ? { ...idea, likes: idea.likes + 1 } : idea
      )
    );
  };

  const handleSwipeRight = async (ideaId: number) => {
    if (!user) return;

    try {
      const response = await fetch(
        "http://localhost:7000/api/ideas/swipe-right",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            ideaId: ideaId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register interest");
      }

      // Successfully registered interest on the server
      console.log("Successfully expressed interest in idea");
    } catch (error) {
      console.error("Error registering interest:", error);
    }
  };

  // New functions for swiping
  const handleSwipe = (info: PanInfo) => {
    if (info.offset.x > 100) {
      // Swiped right - add to bucket list
      addToBucketList();
      // Also register interest on the server
      if (currentIdea) {
        handleSwipeRight(currentIdea.id);
      }
    } else if (info.offset.x < -100) {
      // Swiped left - skip
      nextIdea();
    }
  };

  const addToBucketList = () => {
    if (currentIndex < filteredIdeas.length) {
      setBucketList([...bucketList, filteredIdeas[currentIndex]]);
      setDirection("right");
      setTimeout(() => {
        setDirection("");
        nextIdea();
      }, 300);
    }
  };

  const nextIdea = () => {
    if (currentIndex < filteredIdeas.length - 1) {
      setDirection("left");
      setTimeout(() => {
        setDirection("");
        setCurrentIndex(currentIndex + 1);
      }, 300);
    }
  };

  const removeFromBucketList = (ideaId: number) => {
    setBucketList(bucketList.filter((idea) => idea.id !== ideaId));
  };

  // Get current idea to display
  const currentIdea = filteredIdeas[currentIndex];
  const isLastCard = currentIndex >= filteredIdeas.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-end mb-8 w-full">
            <div className="w-full">
              <h1 className="text-3xl font-bold text-gray-900">
                Discover Ideas
              </h1>
              <p className="mt-2 text-gray-600">
                Swipe right to save ideas to your bucket list, or left to skip.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-row space-x-2 justify-end w-full">
              <button
                onClick={() => setShowBucketList(!showBucketList)}
                className="inline-flex items-center px-3 md:px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {showBucketList
                  ? "Back to Swiping"
                  : `Bucket List (${bucketList.length})`}
              </button>
              <Link
                href="/submit-idea"
                className="inline-flex items-center px-3 md:px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Submit New Idea
              </Link>

              <button
                onClick={() => setFiltersVisible(!filtersVisible)}
                className="inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Filters */}
          {filtersVisible && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 mt-4">
                  <div>
                    <label
                      htmlFor="search"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Search
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="search"
                        id="search"
                        className="block w-full pr-10 p-2 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Search ideas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="industry"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Industry
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                    >
                      <option value="all">All Industries</option>
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

                  <div>
                    <label
                      htmlFor="sortBy"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Sort By
                    </label>
                    <select
                      id="sortBy"
                      name="sortBy"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="newest">Newest First</option>
                      <option value="mostLiked">Most Liked</option>
                      <option value="mostDiscussed">Most Discussed</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedIndustry("all");
                        setSortBy("newest");
                      }}
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Swipeable Cards or Bucket List */}
          {showBucketList ? (
            // Bucket List View
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Your Bucket List
              </h2>
              {bucketList.length === 0 ? (
                <div className="bg-white shadow sm:rounded-lg p-6 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Your bucket list is empty
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Swipe right on ideas you like to add them here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {bucketList.map((idea) => (
                    <div
                      key={idea.id}
                      className="bg-white shadow overflow-hidden sm:rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="px-4 py-5 sm:px-6">
                        <div className="flex justify-between">
                          <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {idea.title}
                          </h3>
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${
                              idea.industry === "technology"
                                ? "bg-blue-100 text-blue-800"
                                : idea.industry === "health"
                                ? "bg-green-100 text-green-800"
                                : idea.industry === "finance"
                                ? "bg-purple-100 text-purple-800"
                                : idea.industry === "education"
                                ? "bg-yellow-100 text-yellow-800"
                                : idea.industry === "ecommerce"
                                ? "bg-pink-100 text-pink-800"
                                : idea.industry === "sustainability"
                                ? "bg-emerald-100 text-emerald-800"
                                : idea.industry === "food"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {idea.industry.charAt(0).toUpperCase() +
                              idea.industry.slice(1)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {idea.problem}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {idea.solution}
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <button
                            onClick={() => handleLike(idea.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Like {idea.likes}
                          </button>
                          <button
                            onClick={() => removeFromBucketList(idea.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Swipeable Cards View
            <div className="flex justify-center items-center mt-8">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : filteredIdeas.length === 0 ? (
                <div className="bg-white shadow sm:rounded-lg p-6 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No ideas found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter to find what you&apos;re
                    looking for.
                  </p>
                </div>
              ) : isLastCard && direction === "left" ? (
                <div className="bg-white shadow sm:rounded-lg p-6 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    You&apos;ve seen all ideas!
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Check your bucket list or adjust filters to see more ideas.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                  {/* Left sidebar - only visible on large screens */}
                  <div className="hidden lg:block">
                    <div className="bg-white shadow rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        How It Works
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                            1
                          </span>
                          <p className="text-gray-600">
                            Swipe right to add ideas to your bucket list
                          </p>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                            2
                          </span>
                          <p className="text-gray-600">
                            Swipe left to skip ideas you&apos;re not interested
                            in
                          </p>
                        </li>
                        <li className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                            3
                          </span>
                          <p className="text-gray-600">
                            View your bucket list anytime to review saved ideas
                          </p>
                        </li>
                      </ul>

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Popular Industries
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "technology",
                            "health",
                            "education",
                            "sustainability",
                            "ecommerce",
                          ].map((ind) => (
                            <button
                              key={ind}
                              onClick={() => setSelectedIndustry(ind)}
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                selectedIndustry === ind
                                  ? "bg-indigo-100 text-indigo-800"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                              }`}
                            >
                              {ind.charAt(0).toUpperCase() + ind.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main card */}
                  <div className="relative">
                    {currentIdea && (
                      <motion.div
                        ref={cardRef}
                        className="bg-white shadow-lg rounded-lg overflow-hidden"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(e, info) => handleSwipe(info)}
                        animate={{
                          x:
                            direction === "left"
                              ? -300
                              : direction === "right"
                              ? 300
                              : 0,
                          opacity: direction ? 0 : 1,
                          rotateZ:
                            direction === "left"
                              ? -10
                              : direction === "right"
                              ? 10
                              : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">
                              {currentIdea.title}
                            </h2>
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                currentIdea.industry === "technology"
                                  ? "bg-blue-100 text-blue-800"
                                  : currentIdea.industry === "health"
                                  ? "bg-green-100 text-green-800"
                                  : currentIdea.industry === "finance"
                                  ? "bg-purple-100 text-purple-800"
                                  : currentIdea.industry === "education"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : currentIdea.industry === "ecommerce"
                                  ? "bg-pink-100 text-pink-800"
                                  : currentIdea.industry === "sustainability"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : currentIdea.industry === "food"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {currentIdea.industry.charAt(0).toUpperCase() +
                                currentIdea.industry.slice(1)}
                            </span>
                          </div>

                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              The Problem:
                            </h3>
                            <p className="text-gray-600">
                              {currentIdea.problem}
                            </p>
                          </div>

                          <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              The Solution:
                            </h3>
                            <p className="text-gray-600">
                              {currentIdea.solution}
                            </p>
                          </div>

                          <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>By {currentIdea.creator}</span>
                            <span>
                              {new Date(
                                currentIdea.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="mt-4 flex justify-between items-center">
                            <div>
                              <span className="text-gray-600 mr-4">
                                <svg
                                  className="w-5 h-5 inline mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                    clipRule="evenodd"
                                    fillRule="evenodd"
                                  ></path>
                                </svg>
                                {currentIdea.likes}
                              </span>
                              <span className="text-gray-600">
                                <svg
                                  className="w-5 h-5 inline mr-1"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
                                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"></path>
                                </svg>
                                {currentIdea.comments}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4">
                          <p className="text-xs text-gray-500">
                            Swipe right to add to bucket list, swipe left to
                            skip
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Swipe buttons */}
                    <div className="flex justify-center mt-6 space-x-8">
                      <button
                        onClick={nextIdea}
                        className="p-4 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                      >
                        <svg
                          className="w-8 h-8 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={addToBucketList}
                        className="p-4 bg-white rounded-full shadow-md hover:bg-green-50 transition-colors"
                      >
                        <svg
                          className="w-8 h-8 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Right sidebar - only visible on large screens */}
                  <div className="hidden lg:block">
                    <div className="bg-white shadow rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Your Bucket List
                      </h3>
                      {bucketList.length === 0 ? (
                        <div className="text-center py-8">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                            />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">
                            Your bucket is empty
                          </p>
                          <p className="text-xs text-gray-400">
                            Swipe right on ideas you like
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                          {bucketList.slice(0, 2).map((idea) => (
                            <div
                              key={idea.id}
                              className="border-b border-gray-200 pb-4 last:border-0"
                            >
                              <h4 className="font-medium text-gray-900">
                                {idea.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {idea.problem}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-gray-500">
                                  {idea.industry}
                                </span>
                                <button
                                  onClick={() => removeFromBucketList(idea.id)}
                                  className="text-xs text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                          {bucketList.length > 3 && (
                            <button
                              onClick={() => setShowBucketList(true)}
                              className="w-full text-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                              View all {bucketList.length} saved ideas →
                            </button>
                          )}
                        </div>
                      )}

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Quick Stats
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-indigo-50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-indigo-600">
                              {filteredIdeas.length}
                            </p>
                            <p className="text-xs text-indigo-700">
                              Total Ideas
                            </p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3 text-center">
                            <p className="text-2xl font-bold text-green-600">
                              {bucketList.length}
                            </p>
                            <p className="text-xs text-green-700">
                              Saved Ideas
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseIdeasPage;
