"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import Modal from "../../components/ui/Modal";
import { FaEdit } from "react-icons/fa";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [userDetails, setUserDetails] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:7000/api/user-details/user-details",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.id}`,
            },
          }
        );

        const data = await response.json();

        if (data.data && data.data.length > 0) {
          setUserDetails(data.data[0]); // Assuming we want the first user detail
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user?.id, isModalOpen]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Not Logged In
          </h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Your Profile
        </h1>

        {userDetails ? (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start mb-8">
              <div className="flex items-start md:items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 blur-sm opacity-70"></div>
                  <img
                    src={userDetails.avatar}
                    alt="User Avatar"
                    className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white shadow-md object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {userDetails.name}
                  </h2>
                  <p className="text-md sm:text-lg text-indigo-600 font-medium">
                    {userDetails.occupation}
                  </p>
                </div>
              </div>
              <div className="md:block hidden">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-5 rounded-xl">
                <p className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-2">
                  Field of Interest
                </p>
                <div className="flex flex-wrap gap-2">
                  {userDetails.fieldOfInterest.map((field: string) => (
                    <span
                      key={field}
                      className="px-2 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm rounded-full"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>

              {userDetails.occupation === "Student" && (
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-5 rounded-xl">
                  <p className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-2">
                    College
                  </p>
                  <p className="text-lg font-medium text-gray-800">
                    {userDetails.college || "N/A"}
                  </p>
                </div>
              )}
              <div className="md:hidden block justify-end items-end w-full">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <FaEdit />
                <span>Edit Profile</span>
              </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Complete Your Profile
            </h2>
            <p className="text-gray-600 mb-4">
              Please provide your details to complete your profile.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Create Profile
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
