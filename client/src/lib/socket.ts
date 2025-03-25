import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => socket;

export const initiateSocket = (token: string, userId: string) => {
  if (socket && socket.connected) {
    console.log("Socket already connected");
    return socket;
  }

  const serverUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:7000";

  socket = io(serverUrl, {
    auth: {
      token: token,
      userId: userId,
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log(`Socket connected for user ${userId}:`, socket?.id);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error details:", {
      message: error.message,
      userId: userId,
      context: error,
    });
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
