import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl mx-auto max-w-4xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                User Details
              </h2>
              <button
                onClick={onClose}
                className="text-red-600 hover:text-red-800 text-lg font-bold cursor-pointer transition-colors"
              >
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>

            {userDetails ? (
              <div className="space-y-6">
                {userDetails.map((user: any) => (
                  <div key={user._id} className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Name</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {user.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Occupation
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {user.occupation}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Field of Interest
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {user.fieldOfInterest.join(", ")}
                      </p>
                    </div>

                    {user.occupation === "Student" && (
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          College
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {user.college}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Avatar
                      </p>
                      <div className="flex items-center space-x-4">
                        <img
                          src={user.avatar}
                          alt="User Avatar"
                          className="w-24 h-24 rounded-full border-4 border-gray-200 shadow-md object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Loading...</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GetModel;
