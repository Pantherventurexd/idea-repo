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
      <div className="p-4 flex items-center justify-between border-b shadow-sm">
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Messages
        </h2>
        <div className="flex items-center space-x-2">
          <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages"
            className="w-full p-2.5 pl-10 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveSection("chats")}
          className={`flex-1 p-3 text-center font-medium transition-colors ${
            activeSection === "chats"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center justify-center">
            <MessageCircle size={18} className="mr-2" />
            Chats
          </div>
        </button>
        <button
          onClick={() => setActiveSection("interested")}
          className={`flex-1 p-3 text-center font-medium transition-colors ${
            activeSection === "interested"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center justify-center">
            <Users size={18} className="mr-2" />
            Interested
          </div>
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
                  className={`p-3 flex items-center rounded-lg cursor-pointer transition-all ${
                    conversation._id === selectedConversation?._id
                      ? "bg-indigo-50 border-l-4 border-indigo-500"
                      : "hover:bg-gray-50 border-l-4 border-transparent"
                  }`}
                  onClick={() => handleConversationClick(conversation._id)}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-3 flex items-center justify-center text-white text-lg shadow-sm">
                    {conversation.otherParticipant?.name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-800 truncate">
                        {conversation.otherParticipant?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
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
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <MessageCircle size={40} className="mb-2 text-gray-300" />
                <p className="font-medium">No conversations yet</p>
                <p className="text-sm">Start chatting with someone!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-2">
            {filteredIdeas.length > 0 ? (
              filteredIdeas.map((idea) => (
                <div key={idea.ideasId} className="mb-4">
                  <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 font-medium rounded-lg text-indigo-700 shadow-sm">
                    {idea.title}
                  </div>
                  {idea.interested_users.map((user, key) => (
                    <div
                      key={key}
                      className="p-3 flex items-center justify-between hover:bg-gray-50 rounded-lg cursor-pointer transition-all"
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setIsModalOpen(true);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-3 flex items-center justify-center text-white shadow-sm">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                <Users size={40} className="mb-2 text-gray-300" />
                <p className="font-medium">No interested users found</p>
                <p className="text-sm">Share your ideas to connect!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal for Starting Conversation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full transform transition-all">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Start Conversation
            </h2>
            <p className="text-gray-600 mb-6">
              Do you want to start a conversation with this user?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
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
