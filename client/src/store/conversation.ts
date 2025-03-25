import { create } from "zustand";
import { getConversation } from "../api/conversation";
import { Conversation } from "@/type";

interface ConversationState {
  conversation: Conversation[] | null;
  fetchConversation: (userId: string) => Promise<void>;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversation: null,
  fetchConversation: async (userId: string) => {
    console.log("fetchConversation called with userId:", userId);
    try {
      console.log("Making API call to get conversation");
      const data = await getConversation(userId);
      console.log("Conversation API response:", data);
      set({ conversation: data });
    } catch (error) {
      console.error("Failed to fetch conversation:", error);
    }
  },
}));
