"use client";
import { Send, MoreVertical, Paperclip, Smile } from "lucide-react";
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
        <div className="p-4 border-b flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full mr-4 flex items-center justify-center text-white text-lg">
              {selectedConversation.otherParticipant?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="font-semibold text-lg">
                {selectedConversation.otherParticipant?.name || "User"}
              </p>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
              <MoreVertical size={20} />
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
          <div className="flex flex-col space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    p-3 rounded-lg max-w-md relative
                    ${
                      msg.sender === "me"
                        ? "bg-blue-500 text-white"
                        : "bg-white shadow-sm"
                    }
                  `}
                >
                  {msg.text}
                  <div
                    className={`text-xs mt-1 ${
                      msg.sender === "me" ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {msg.timestamp && formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a conversation to view messages
          </div>
        )}
      </div>

      {/* Message Input */}
      {selectedConversation && (
        <div className="p-4 border-t bg-white flex items-center space-x-2">
          <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
            <Paperclip size={20} />
          </button>
          <button className="text-gray-600 hover:bg-gray-100 p-2 rounded-full">
            <Smile size={20} />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 p-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            disabled={!message.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      )}
    </div>
  );
};