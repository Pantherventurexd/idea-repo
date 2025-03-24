import React, { useState, useRef, useEffect } from "react";
import { User, Message } from "../types";
import Image from "next/image";

interface ChatMainProps {
  selectedUser: User;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export const ChatMain: React.FC<ChatMainProps> = ({
  selectedUser,
  messages,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((message) => {
      const date = message.timestamp.toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Image
            src={selectedUser.avatar}
            alt={selectedUser.name}
            height={40} width={40}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <h3 className="font-medium">{selectedUser.name}</h3>
            <span
              className={`text-sm ${
                selectedUser.status === "online"
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              {selectedUser.status === "online"
                ? "Online"
                : "Last seen " +
                  selectedUser.lastSeen.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-purple-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-purple-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-purple-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-white">
        {Object.entries(messageGroups).map(([date, msgs]) => (
          <div key={date} className="space-y-4">
            <div className="relative flex justify-center">
              <span className="bg-white text-gray-500 text-xs px-2 relative z-10">
                {new Date(date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-200"></div>
            </div>

            {msgs.map((message) => (
              <div
                key={message.id}
                className={`flex max-w-[70%] ${
                  message.senderId === "me" ? "ml-auto" : "mr-auto"
                }`}
              >
                {message.senderId !== "me" && (
                  <Image
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    height={32} width={32}
                    className="w-8 h-8 rounded-full mr-2 self-end"
                  />
                )}
                <div
                  className={`flex flex-col ${
                    message.senderId === "me" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      message.senderId === "me"
                        ? "bg-purple-600 text-white rounded-tr-none"
                        : "bg-purple-50 text-gray-900 rounded-tl-none"
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-500 space-x-1">
                    <span>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {message.senderId === "me" && (
                      <span className={message.read ? "text-purple-500" : ""}>
                        {message.read ? "✓✓" : "✓"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        className="flex items-center p-4 border-t border-gray-200 gap-3"
        onSubmit={handleSendMessage}
      >
        <button type="button" className="text-gray-500 hover:text-purple-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 py-2 px-4 bg-gray-100 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button type="button" className="text-gray-500 hover:text-purple-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            newMessage.trim()
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};