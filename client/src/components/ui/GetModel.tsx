import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { FaTimes } from "react-icons/fa";

interface GetModelProps {
  isOpen: boolean;
  onClose: () => void;
}

const GetModel: React.FC<GetModelProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [userDetails, setUserDetails] = useState<any | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id) return; // Check if userId exists

      try {
        const response = await fetch(
          "http://localhost:7000/api/user-details/user-details",
          {
            method: "GET", // Use GET request
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.id}`, // Send userId via Authorization header (if needed)
            },
          }
        );

        const data = await response.json();

        if (data.data) {
          setUserDetails(data.data); // Set the fetched user details
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (isOpen) {
      fetchUserDetails();
    }
  }, [isOpen, user?.id]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl mx-auto max-w-md w-full border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold  bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                User Details
              </h2>
              <button
                onClick={onClose}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <FaTimes size={16} className="text-gray-500" />
              </button>
            </div>

            {userDetails ? (
              <div className="space-y-6">
                {userDetails.map((user: any) => (
                  <div key={user._id} className="space-y-5">
                    <div>
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 blur-sm opacity-70"></div>
                          <img
                            src={user.avatar}
                            alt="User Avatar"
                            className="relative w-16 h-16 rounded-full border-2 border-white shadow-md object-cover"
                          />
                        </div>

                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Name
                          </p>
                          <p className="text-lg font-medium text-gray-800">
                            {user.name || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Occupation
                      </p>
                      <p className="text-lg font-medium text-gray-800">
                        {user.occupation || "N/A"}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                        Field of Interest
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.fieldOfInterest.map((field: string) => (
                          <span
                            key={field}
                            className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-sm rounded-full"
                          >
                            {field}
                          </span>
                        )) || "N/A"}
                      </div>
                    </div>

                    {user.occupation === "Student" && (
                      <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl">
                        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                          College
                        </p>
                        <p className="text-lg font-medium text-gray-800">
                          {user.college || "N/A"}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
                <p className="mt-4 text-gray-500">Loading your details...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GetModel;
