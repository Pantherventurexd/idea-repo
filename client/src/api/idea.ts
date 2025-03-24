import axios from "axios";

export const fetchUserIdeas = async (userId: string) => {
  try {
    const response = await axios.post(
      `http://localhost:7000/api/ideas/get-user-ideas`,
      { userId }
    );
    return response.data.ideas;
  } catch (error) {
    console.error("Error fetching user ideas:", error);
    throw error; // Rethrow the error for handling in the store
  }
};
