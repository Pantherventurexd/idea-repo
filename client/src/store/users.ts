import { create } from "zustand";
import { fetchUsersByIds } from "../api/users";

interface UserState {
  userss: any[];
  fetchUsers: (userIds: string[]) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  userss: [],
  fetchUsers: async (userIds) => {
    try {
      const fetchedUsers = await fetchUsersByIds(userIds);
      set({ userss: fetchedUsers });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  },
}));
