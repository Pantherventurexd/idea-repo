import { create } from "zustand";
import { fetchUserIdeas } from "../api/idea";

interface UserIdea {
  _id: string;
  title: string;
  problem: string;
  solution: string;
  market: string;
  monetization: string;
  industry: string;
  userId: string;
  plagiarism_score: number;
  uniqueness_score: number;
  feasibility_score: number;
  success_score: number;
  final_score: string;
  existing_startups: object[];
  competitors: object[];
  business_presence: { [key: string]: number };
  interested_users: string[];
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IdeaStore {
  userIdeas: UserIdea[];
  fetchUserIdeas: (userId: string) => Promise<void>;
  filterIdeasByInterestedUser: (
    userIdeas: UserIdea[]
  ) => { ideasId: string; title: string; interested_users: string[] }[];
}

const useIdeaStore = create<IdeaStore>((set) => ({
  userIdeas: [],
  interestedUser: "",
  fetchUserIdeas: async (userId: string) => {
    try {
      const ideas = await fetchUserIdeas(userId);
      set({ userIdeas: ideas });
    } catch (error) {
      console.error("Error fetching user ideas:", error);
    }
  },
  filterIdeasByInterestedUser: (userIdeas) => {
    return userIdeas
      .filter(
        (idea) =>
          idea.interested_users.length > 0 
      )
      .map((idea) => ({
        ideasId: idea._id,
        title: idea.title,
        interested_users: idea.interested_users,
      }));
  },
}));

export default useIdeaStore;
