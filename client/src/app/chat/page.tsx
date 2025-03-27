"use client";
import { ChatMain } from "./components/ChatMain";
import { ChatSidebar } from "./components/ChatSidebar";
import { useAuthStore } from "@/store/authStore";
import { useConversationStore } from "@/store/conversation";
import { useUserStore } from "@/store/users";
import { useEffect } from "react";
import { useIdeaStore } from "@/store/idea";
import { initiateSocket } from "@/lib/socket";

const ChatPage = () => {
  const { user } = useAuthStore();
  const { users, fetchUsers } = useUserStore();
  const { fetchUserIdeas, filterIdeasByInterestedUser, userIdeas } =
    useIdeaStore();

  useEffect(() => {
    if (user?.id) {
      fetchUsers([user.id]);
      fetchUserIdeas(user.id);

      // Initialize socket connection when the chat page loads
      const token ="xyz"
      if (token) {
        initiateSocket(token, user.id);
      }
    }
  }, [user, fetchUsers]);

  let filteredIdeas;
  if (userIdeas) {
    filteredIdeas = filterIdeasByInterestedUser(userIdeas).map((idea) => ({
      ideasId: idea.ideasId,
      title: idea.title,
      interested_users: idea.interested_users.map((user) => ({
        id: user.id,
        email: user.email,
      })),
    }));
  }

  console.log(filteredIdeas, "filteredIdeas");

  console.log("users", users);

  return (
    <div className="flex h-screen overflow-hidden pt-16">
      <ChatSidebar
        filteredIdeas={filteredIdeas}
        users={Array.isArray(users) ? users : [users]}
      />
      <ChatMain  users={Array.isArray(users) ? users : [users]} />
    </div>
  );
};

export default ChatPage;
