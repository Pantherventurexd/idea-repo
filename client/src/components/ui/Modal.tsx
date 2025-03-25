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
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg mx-auto max-w-4xl space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-800">
                User Details
              </h2>
              <button onClick={onClose} className="cursor-pointer">
                <FaTimes size={14} color="red" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 "
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Occupation</p>
                <div className="flex space-x-3 mt-2">
                  {["Student", "Founder", "Developer", "Designer"].map(
                    (occ) => (
                      <button
                        key={occ}
                        onClick={() => handleOccupationClick(occ)}
                        className={`px-5 cursor-pointer py-2 text-sm font-normal transition duration-200 ${
                          occupation === occ
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-black border-2 border-gray-500"
                        }`}
                      >
                        {occ}
                      </button>
                    )
                  )}
                </div>
              </div>

              {occupation === "Student" && (
                <div>
                  <label
                    htmlFor="college"
                    className="block text-sm font-medium text-gray-700"
                  >
                    College Name
                  </label>
                  <input
                    type="text"
                    id="college"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="mt-2 w-full px-4 py-2 border border-gray-300"
                    placeholder="Enter your college name"
                  />
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Field of Interest
                </p>
                <div className="flex space-x-3 mt-2">
                  {["Technology", "Art", "Science", "Business"].map((field) => (
                    <button
                      key={field}
                      onClick={() => handleFieldOfInterestClick(field)}
                      className={`px-5 py-2 cursor-pointer text-sm font-normal transition duration-200 ${
                        fieldOfInterest.includes(field)
                          ? "bg-indigo-600 text-white"
                          : "bg-white text-black border-2 border-gray-500"
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
                  className="block text-sm font-medium text-gray-700"
                >
                  Avatar
                </label>
                <div className="mt-2 flex items-center justify-center border-2 border-gray-300 p-4 rounded-lg relative">
                  <label htmlFor="avatar" className="cursor-pointer">
                    <FaCamera className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-4xl" />
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <span className="block mt-2 text-sm text-gray-500">
                      Choose a file
                    </span>
                  </label>
                </div>
                {avatarSelected && (
                  <p className="mt-2 text-green-500 text-sm">
                    Avatar selected successfully!
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-indigo-500 text-white  font-semibold hover:bg-indigo-600 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
