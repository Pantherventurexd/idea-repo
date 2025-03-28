"use client";
import {
  Send,
  MoreVertical,
  Paperclip,
  Smile,
  MessageCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { useConversationStore } from "@/store/conversation";
import { User } from "@/store/users";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  timestamp: Date;
}

export const ChatMain = ({ users }: { users?: User[] }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const { selectedConversation } = useConversationStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedConversation) {
      setMessages([]);

      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `http://localhost:7000/api/messages/${selectedConversation._id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            setMessages(
              data.map((msg) => ({
                id: msg._id,
                text: msg.content,
                sender:
                  users && msg.sender === users[0]?.user_id ? "me" : "other",
                timestamp: new Date(msg.createdAt || msg.timestamp),
              }))
            );
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [selectedConversation, users]);

  useEffect(() => {
    const socket = getSocket();

    if (socket) {
      socket.on("message", (newMessage) => {
        if (newMessage.conversationId === selectedConversation?._id) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: newMessage._id,
              text: newMessage.content,
              sender:
                users && newMessage.senderId === users[0]?.user_id
                  ? "me"
                  : "other",
              timestamp: new Date(newMessage.timestamp),
            },
          ]);
        }
      });

      return () => {
        socket.off("message");
      };
    }
  }, [selectedConversation, users]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (
      message.trim() &&
      selectedConversation?._id &&
      users?.length &&
      users[0]?.user_id
    ) {
      const socket = getSocket();

      if (socket) {
        socket.emit(
          "message",
          {
            user_id: users[0]?.user_id,
            conversationId: selectedConversation._id,
            content: message,
            messageType: "text",
          },
          (response) => {
            if (response.error) {
              console.error("Error sending message:", response.error);
            } else {
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  id: response._id,
                  text: message,
                  sender: "me",
                  timestamp: new Date(),
                },
              ]);
              setMessage("");
            }
          }
        );
      } else {
        console.error("Socket not connected");
      }
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Chat Header */}
      {selectedConversation ? (
        <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-3 flex items-center justify-center text-white text-lg shadow-md">
              {selectedConversation.otherParticipant?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {selectedConversation.otherParticipant?.name || "User"}
              </p>
              <p className="text-xs text-green-600 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 inline-block"></span>
                Online
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 border-b bg-white text-center text-gray-500">
          Select a conversation to start chatting
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {selectedConversation ? (
          <div className="flex flex-col space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "other" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-2 flex-shrink-0 self-end mb-1">
                    {selectedConversation.otherParticipant?.name?.charAt(0) ||
                      "U"}
                  </div>
                )}
                <div
                  className={`
                    p-3 rounded-2xl max-w-xs sm:max-w-md break-words
                    ${
                      msg.sender === "me"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-sm"
                        : "bg-white rounded-tl-none shadow-sm border border-gray-100"
                    }
                  `}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <div
                    className={`text-xs mt-1 text-right ${
                      msg.sender === "me" ? "text-indigo-100" : "text-gray-400"
                    }`}
                  >
                    {msg.timestamp && formatTime(msg.timestamp)}
                  </div>
                </div>
                {msg.sender === "me" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full ml-2 flex-shrink-0 self-end mb-1 opacity-0">
                    {/* This is invisible, just for alignment */}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <MessageCircle size={48} className="mb-3 text-gray-300" />
            <p className="text-lg font-medium">Select a conversation</p>
            <p className="text-sm">Choose a contact to start messaging</p>
          </div>
        )}
      </div>

      {/* Message Input */}
      {selectedConversation && (
        <div className="p-3 border-t bg-white flex items-center space-x-2">
          <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <Paperclip size={20} />
          </button>
          <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <Smile size={20} />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            onClick={handleSendMessage}
            className={`p-3 rounded-full transition-all ${
              message.trim()
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!message.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
