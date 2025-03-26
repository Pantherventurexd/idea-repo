import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { verifyToken } from "../utils/auth-utils";
import mongoose from "mongoose";

export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    const userId = socket.handshake.auth.userId;

    if (!token || !userId) {
      return next(new Error("Authentication error: Token or UserId missing"));
    }

    try {
      const isValid = await verifyToken(token, userId);
      if (!isValid) {
        return next(new Error("Authentication error: Invalid credentials"));
      }
      (socket as any).user = { id: userId };
      next();
    } catch (error) {
      return next(new Error("Authentication error: Verification failed"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).user.id;
    console.log(`User connected: ${userId} (Socket ID: ${socket.id})`);

    // Handle join-room event
    socket.on("join-room", ({ conversationId }) => {
      if (!conversationId) {
        console.error("No conversation ID provided for join-room event");
        return;
      }

      // Leave all previous rooms (except the socket's default room)
      const rooms = Object.keys(socket.rooms);
      rooms.forEach((room) => {
        if (room !== socket.id) {
          socket.leave(room);
        }
      });

      // Join the new conversation room
      socket.join(conversationId);
      console.log(`User ${userId} joined room: ${conversationId}`);

      // Notify the user they've joined the room
      socket.emit("room-joined", {
        conversationId,
        message: "Successfully joined conversation room",
      });
    });

    socket.on("message", async (data) => {
      console.log(`Message from ${userId}:`, data);

      try {
        // Import the Message model and mongoose
        const Message = require("../models/message").default;

        // Check if userId is a valid MongoDB ObjectId
        let senderId = data.user_id;
       

        // Create a new message document in the database
        const newMessage = await Message.create({
          conversation: data.conversationId,
          sender: senderId,
          content: data.content,
          messageType: data.messageType || "text",
          isGroupMessage: false,
        });

        // If the message has a conversationId, send it only to that room
        if (data.conversationId) {
          // Emit the message to all users in the conversation room
          io.to(data.conversationId).emit("message", {
            ...data,
            senderId: userId, // Keep using the original userId for the client
            timestamp: new Date(),
            _id: newMessage._id,
          });

          // Update the last message in the conversation
          await updateConversationLastMessage(
            data.conversationId,
            senderId, // Use the MongoDB ObjectId here
            data.content
          );
        } else {
          // Fallback to broadcasting to everyone
          io.emit("message", {
            ...data,
            senderId: userId,
            timestamp: new Date(),
            _id: newMessage._id,
          });
        }
      } catch (error) {
        console.error("Error handling message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  // Helper function to update the last message in a conversation
  async function updateConversationLastMessage(
    conversationId: string,
    senderId: string | mongoose.Types.ObjectId,
    content: string
  ) {
    try {
      const Conversation = require("../models/conversation").default;
      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: {
          sender: senderId,
          content: content,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error("Error updating conversation last message:", error);
    }
  }

  return io;
};
