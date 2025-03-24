"use client";
import React, { useState, useEffect } from "react";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatMain } from "./components/ChatMain";
import { ChatProfile } from "./components/ChatProfile";
import { Message, User } from "./types";
import useIdeaStore from "@/store/idea";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/users";

const Chat: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchUsers, userss } = useUserStore();
  const { userIdeas, fetchUserIdeas, filterIdeasByInterestedUser } =
    useIdeaStore();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [mappedUsers, setMappedUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = user?.id;
      if (userId) {
        fetchUserIdeas(userId);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const response = filterIdeasByInterestedUser(userIdeas);

    if (response.length > 0) {
      const interestedUsers = response[0].interested_users;
      fetchUsers(interestedUsers);
    }
  }, [userIdeas]);

  // Map the userss data to the User type format
  useEffect(() => {
    if (userss && userss.length > 0) {
      const mappedUserData = mapUsersToUserFormat(userss);
      setMappedUsers(mappedUserData);
    }
  }, [userss]);

  // Function to map API user data to the User type format
  const mapUsersToUserFormat = (apiUsers: any[]): User[] => {
    return apiUsers.map((user) => ({
      id: user.userId,
      name: user.email.split("@")[0], // Using email username as name
      avatar: `/avatars/default.png`, // Default avatar
      status: "online", // Default status
      lastSeen: new Date(),
      bio: "No bio available", // Default bio
    }));
  };

  // Use mappedUsers instead of mock data
  useEffect(() => {
    if (mappedUsers.length > 0) {
      setUsers(mappedUsers);
    } else {
      // Set empty array instead of mock users
      setUsers([]);
    }

    // Mock messages remain the same for now
    const mockMessages: Message[] = [
      {
        id: "1",
        senderId: "2",
        receiverId: "me",
        content: "Hey Sasuke where are you?",
        timestamp: new Date(),
        read: true,
      },
      {
        id: "2",
        senderId: "me",
        receiverId: "2",
        content: "On my way!",
        timestamp: new Date(),
        read: true,
      },
    ];

    setMessages(mockMessages);
  }, [mappedUsers]);

  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      receiverId: selectedUser.id,
      content,
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, newMessage]);
  };

  return (
    <div className="fixed inset-0 pt-16 flex bg-white text-gray-900">
      <ChatSidebar
        users={users}
        messages={messages}
        onSelectUser={handleSelectUser}
        selectedUser={selectedUser}
      />
      {selectedUser ? (
        <ChatMain
          selectedUser={selectedUser}
          messages={messages.filter(
            (m) =>
              (m.senderId === selectedUser.id && m.receiverId === "me") ||
              (m.senderId === "me" && m.receiverId === selectedUser.id)
          )}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>Select a conversation to start chatting</p>
        </div>
      )}
      {selectedUser && <ChatProfile user={selectedUser} />}
    </div>
  );
};

export default Chat;
