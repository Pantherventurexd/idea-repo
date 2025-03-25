import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { verifyToken } from "../utils/auth-utils";

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

    socket.on("message", (data) => {
      console.log(`Message from ${userId}:`, data);

      // If the message has a conversationId, send it only to that room
      if (data.conversationId) {
        io.to(data.conversationId).emit("message", {
          ...data,
          senderId: userId,
          timestamp: new Date(),
        });
      } else {
        // Fallback to broadcasting to everyone (not recommended for production)
        io.emit("message", {
          ...data,
          senderId: userId,
          timestamp: new Date(),
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
};
