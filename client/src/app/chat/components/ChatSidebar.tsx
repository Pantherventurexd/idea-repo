import React, { useState, useEffect } from "react";
import { User, Message } from "../types";
import Image from "next/image";
import { useConversationStore } from "@/store/conversation";

interface ChatSidebarProps {
  users: User[];
  messages: Message[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  users,
  messages,
  selectedUser,
  onSelectUser,
}) => {
  const { conversation } = useConversationStore();
  const [searchQuery, setSearchQuery] = useState("");



  // Get the last message for each user
  const getUserLastMessage = (userId: string) => {
    const userMessages = messages.filter(
      (m) =>
        (m.senderId === userId && m.receiverId === "me") ||
        (m.senderId === "me" && m.receiverId === userId)
    );
    if (userMessages.length === 0) return null; // Return null if no messages
    return userMessages.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    )[0];
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Count online users

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col overflow-hidden bg-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium">Messages ({messages.length})</h3>
        </div>

        {/* Conversations Section */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium">Conversations</h3>
          <div className="flex-1 overflow-y-auto">
            {conversation && conversation.length > 0 ? (
              conversation.map((conv, index) => {
                const lastMessage = getUserLastMessage(conv.userId);
                return (
                  <div
                key={index}
                    
                    className={`flex p-3 border-b border-gray-200 cursor-pointer relative 
                  
                    `}
                    // onClick={() => onSelectUser(conv.user)}
                  >
                    {/* User Avatar and Status */}
                    <div className="relative">
                     
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500">👤</span>
                        </div>
                      
                     
                    </div>
                    <div className="ml-3 flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Ayush</h4>
                        {lastMessage && (
                          <span className="text-xs text-gray-500">
                            {lastMessage.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                      {lastMessage && (
                        <p className="text-sm text-gray-500 truncate">
                          {lastMessage.senderId === "me" ? "You: " : ""}
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                    {!lastMessage?.read && lastMessage?.senderId !== "me" && (
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-purple-500"></span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-gray-500">
                No conversations found
              </div>
            )}
          </div>
        </div>

        {/* Interested Users Section */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium">
            Interested Users ({filteredUsers.length})
          </h3>
        </div>
        <div className="p-3 relative">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-3 pr-8 rounded bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <svg
            className="w-4 h-4 text-gray-500 absolute right-6 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const lastMessage = getUserLastMessage(user.id);
              return (
                <div
                  key={user.id}
                  className={`flex p-3 border-b border-gray-200 cursor-pointer relative ${
                    selectedUser?.id === user.id
                      ? "bg-purple-50"
                      : "hover:bg-purple-50"
                  }`}
                  onClick={() => onSelectUser(user)}
                >
                  <div className="relative">
                    {!user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        height={40}
                        width={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-500">👤</span>
                      </div>
                    )}
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        user.status === "online"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></span>
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{user.name}</h4>
                      {lastMessage && (
                        <span className="text-xs text-gray-500">
                          {lastMessage.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="text-sm text-gray-500 truncate">
                        {lastMessage.senderId === "me" ? "You: " : ""}
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                  {!lastMessage?.read && lastMessage?.senderId !== "me" && (
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-purple-500"></span>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-500">No users found</div>
          )}
        </div>
      </div>
    </div>
  );
};
