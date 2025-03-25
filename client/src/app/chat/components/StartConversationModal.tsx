import React, { useState } from "react";
import axios from "axios";

interface StartConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  currentUserId: string;
  socket: any;
  onConversationStart: (conversationId: string) => void;
}

export const StartConversationModal: React.FC<StartConversationModalProps> = ({
  isOpen,
  onClose,
  user,
  currentUserId,
  socket,
  onConversationStart,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartConversation = async () => {
    if (!isOpen) return;

    setIsLoading(true);
    setError(null);

    try {
      // Make API call to start conversation with both user IDs
      const response = await axios.post(
        "http://localhost:7000/api/conversation/start-conversation",
        {
          userId: currentUserId,
          otherUserId: user.id,
        }
      );

      // Get conversation ID from response
      const conversationId = response.data.conversationId;

      // Emit socket event to join room
      if (socket) {
        socket.emit("join-room", { conversationId });
        onConversationStart(conversationId);
      }

      onClose();
    } catch (err) {
      setError("Failed to start conversation. Please try again.");
      console.error("Start conversation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Ready to Connect?</h2>
        <p className="text-gray-600 mb-6">
          You are about to start a conversation with {user.name}. Are you ready?
        </p>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleStartConversation}
            disabled={isLoading}
            className={`px-4 py-2 rounded ${
              isLoading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-purple-600 text-white hover:bg-purple-700"
            }`}
          >
            {isLoading ? "Connecting..." : "Start Conversation"}
          </button>
        </div>
      </div>
    </div>
  );
};
