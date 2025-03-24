import axios from "axios";

export const fetchUsersByIds = async (userIds: string[]): Promise<any> => {
    try {
      const response = await axios.post("http://localhost:7000/api/users/get-user", {
        userIds,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users by IDs:", error);
      throw new Error("Failed to fetch users");
    }
  };
  