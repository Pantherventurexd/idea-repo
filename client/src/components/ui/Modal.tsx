import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { FaTimes, FaCamera } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState<string | null>(null);
  const [fieldOfInterest, setFieldOfInterest] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [college, setCollege] = useState("");
  const [avatarSelected, setAvatarSelected] = useState(false);

  const handleOccupationClick = (occupation: string) => {
    setOccupation(occupation);
  };

  const handleFieldOfInterestClick = (field: string) => {
    setFieldOfInterest((prev) =>
      prev.includes(field)
        ? prev.filter((item) => item !== field)
        : [...prev, field]
    );
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatar(reader.result.toString());
          setAvatarSelected(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    const formData: any = {
      userId: user.id,
      name,
      occupation,
      fieldOfInterest,
      avatar,
    };
    if (occupation === "Student") {
      formData.college = college;
    }

    try {
      const response = await fetch(
        "http://localhost:7000/api/user-details/user-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        console.log("User details saved successfully!");
        onClose();
      } else {
        console.error("Failed to save user details.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl mx-auto max-w-4xl w-full border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                User Details
              </h2>
              <button
                onClick={onClose}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <FaTimes size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Occupation
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Student", "Founder", "Developer", "Designer"].map(
                    (occ) => (
                      <button
                        key={occ}
                        onClick={() => handleOccupationClick(occ)}
                        className={`px-5 py-2.5 rounded-lg text-sm font-medium transition duration-200 ${
                          occupation === occ
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                            : "bg-white text-gray-700 border border-gray-300 hover:border-indigo-400"
                        }`}
                      >
                        {occ}
                      </button>
                    )
                  )}
                </div>
              </div>

              {occupation === "Student" && (
                <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl">
                  <label
                    htmlFor="college"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    College Name
                  </label>
                  <input
                    type="text"
                    id="college"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    placeholder="Enter your college name"
                  />
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Field of Interest
                </p>
                <div className="flex flex-wrap gap-3">
                  {["Technology", "Art", "Science", "Business"].map((field) => (
                    <button
                      key={field}
                      onClick={() => handleFieldOfInterestClick(field)}
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium transition duration-200 ${
                        fieldOfInterest.includes(field)
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                          : "bg-white text-gray-700 border border-gray-300 hover:border-indigo-400"
                      }`}
                    >
                      {field}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Avatar
                </label>
                <div className="mt-2 flex items-center justify-center border-2 border-dashed border-gray-300 bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl relative">
                  {avatar ? (
                    <div className="relative">
                      <img
                        src={avatar}
                        alt="Selected avatar"
                        className="h-24 w-24 object-cover rounded-full border-2 border-white shadow-md"
                      />
                      <label
                        htmlFor="avatar"
                        className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-indigo-700 transition"
                      >
                        <FaCamera size={14} />
                        <input
                          type="file"
                          id="avatar"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label
                      htmlFor="avatar"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mb-2">
                        <FaCamera size={24} />
                      </div>
                      <input
                        type="file"
                        id="avatar"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <span className="text-sm text-gray-600">
                        Click to upload an image
                      </span>
                    </label>
                  )}
                </div>
                {avatarSelected && (
                  <p className="mt-2 text-green-500 text-sm flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
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
                    Avatar selected successfully!
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
