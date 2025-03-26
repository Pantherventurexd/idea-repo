import { create } from "zustand";
import { fetchUsersByIds } from "../api/users";

export interface User {
  user_id: string;
  supabase_id: string;
  email: string;
}

interface UserState {
  users: User;
  fetchUsers: (userIds: string[]) => Promise<void>;
  
}

export const useUserStore = create<UserState>((set) => ({
  users: { user_id: "", supabase_id: "", email: "" },
  userDetails: { user_id: "", supabase_id: "", email: "" },
  fetchUsers: async (userIds) => {
    try {
      const fetchedUsers = await fetchUsersByIds(userIds);
      set({ users: fetchedUsers });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }
}));
