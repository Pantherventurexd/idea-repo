import { create } from "zustand";


interface Conversation {
  _id: string;
  participants: string[];
  lastMessage?: {
    sender: string;
    content: string;
    timestamp: Date;
  };
  otherParticipant?: {
    id: string;
    name?: string;
    email?: string;
  };
}

interface ConversationState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  setConversations: (conversations: Conversation[]) => void;
  selectConversation: (conversationId: string) => void;
  clearSelectedConversation: () => void;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  selectedConversation: null,

  setConversations: (conversations) => set({ conversations }),

  selectConversation: (conversationId) => {
    const { conversations } = get();
    const conversation = conversations.find((c) => c._id === conversationId);
    set({ selectedConversation: conversation || null });
  },

  clearSelectedConversation: () => set({ selectedConversation: null }),
}));
