"use client";
import React, { useState, useEffect } from "react";
import { Search, MessageCircle, Users, MoreHorizontal } from "lucide-react";
import { User } from "@/store/users";
import { getSocket } from "@/lib/socket";
import { useConversationStore } from "@/store/conversation";
import { useAuthStore } from "@/store/authStore";

interface ChatSidebarProps {
  filteredIdeas?: Array<{
    ideasId: string;
    interested_users: Array<{
      id: string;
      email: string;
    }>;
    title: string;
  }>;
  users?: User[];
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  filteredIdeas = [],
  users = [],
}) => {
  const [activeSection, setActiveSection] = useState("chats");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState([]);
  const { selectConversation, selectedConversation } = useConversationStore();
  const { user } = useAuthStore();

  const startConversation = async () => {
    if (selectedUserId && users) {
      await fetch(`http://localhost:7000/api/conversation/start-conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otherUserId: selectedUserId,
          userId: users[0]?.user_id,
        }),
      });
      setIsModalOpen(false);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    selectConversation(conversationId);
    const socket = getSocket();
    if (socket) {
      socket.emit("join-room", { conversationId });
    } else {
      console.error("Socket not initialized");
    }
  };

  const fetchConversations = async () => {
    if (users.length > 0) {
      try {
        const response = await fetch(
          `http://localhost:7000/api/conversation/get-conversation`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: users[0].user_id,
            }),
          }
        );
        const data = await response.json();

        // Check if data is an array, if not, use data.conversations or an empty array
        const conversationsArray = Array.isArray(data)
          ? data
          : data?.conversations || [];

        const processedConversations = conversationsArray.map((conv) => {
          const otherParticipantId = conv.participants.find(
            (id) => id !== user?.id
          );
          const otherUser = users.find((u) => u.id === otherParticipantId);

          return {
            ...conv,
            otherParticipant: otherUser
              ? {
                  id: otherUser.id,
                  name: otherUser.name || otherUser.email,
                  email: otherUser.email,
                }
              : undefined,
          };
        });

        setConversations(processedConversations);
        useConversationStore
          .getState()
          .setConversations(processedConversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    }
  };

  useEffect(() => {
    if (activeSection === "chats") {
      fetchConversations();
    }
  }, [activeSection]);

  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b">
        <h2 className="text-2xl font-bold">Messages</h2>
        <div className="flex items-center space-x-2">
          <button className="text-gray-600 hover:bg-gray-100 p-1 rounded-full">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages"
            className="w-full p-2 pl-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveSection("chats")}
          className={`flex-1 p-3 text-center font-semibold ${
            activeSection === "chats"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Chats
        </button>
        <button
          onClick={() => setActiveSection("interested")}
          className={`flex-1 p-3 text-center font-semibold ${
            activeSection === "interested"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          Interested
        </button>
      </div>

      {/* Content Based on Active Section */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === "chats" ? (
          <div className="p-2">
            {conversations.length > 0 ? (
              conversations.map((conversation) => (
                <div
                  key={conversation._id}
                  className={`p-3 flex items-center rounded-lg hover:bg-gray-100 cursor-pointer ${
                    conversation._id === selectedConversation?._id
                      ? "bg-blue-50"
                      : ""
                  }`}
                  onClick={() => handleConversationClick(conversation._id)}
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full mr-4 flex items-center justify-center text-white text-lg">
                    {conversation.otherParticipant?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-800">
                        {conversation.otherParticipant?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(
                          conversation.lastMessage?.timestamp || Date.now()
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {conversation.lastMessage?.content || "No messages yet"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No conversations found
              </div>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredIdeas.length > 0 ? (
              filteredIdeas.map((idea) => (
                <div key={idea.ideasId} className="mb-4">
                  <div className="p-3 bg-gray-100 font-medium rounded-lg">
                    {idea.title}
                  </div>
                  {idea.interested_users.map((user, key) => (
                    <div
                      key={key}
                      className="p-3 flex items-center justify-between hover:bg-gray-100 rounded-lg cursor-pointer"
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full mr-3 flex items-center justify-center text-white">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{user.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No interested users found
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for Starting Conversation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Start Conversation</h2>
            <p className="text-gray-600 mb-6">
              Do you want to start a conversation with this user?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                onClick={startConversation}
              >
                Start Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
