import axios from "axios";

export async function getConversation(userId: string) {
  console.log("getConversation API function called with userId:", userId);
  try {
    console.log("Making axios request to get conversation");
    const response = await axios.post(
      "http://localhost:7000/api/conversation/get-conversation",
      { userId }
    );
    console.log("API response received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching conversation:", error);
    throw error;
  }
}
