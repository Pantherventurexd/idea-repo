import { create } from "zustand";
import { fetchUsersByIds, fetchUsersBySupabaseId } from "../api/users";

interface UserState {
  userss: any[];
  userDetails: any;
  fetchUsers: (userIds: string[]) => Promise<void>;
  fetchUserBySupabase: (userIds: string[]) => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  userss: [],
  userDetails: [],
  fetchUsers: async (userIds) => {
    try {
      const fetchedUsers = await fetchUsersByIds(userIds);
      set({ userss: fetchedUsers });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  },

  fetchUserBySupabase: async (userIds) => {
    try {
      const fetchedUsers = await fetchUsersBySupabaseId(userIds);
      set({ userDetails: fetchedUsers });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  },

  

}));
