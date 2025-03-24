import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initiateSocket = (token: string) => {
  socket = io("http://localhost:7000", {
    auth: { token },
  });
  console.log("Socket connected:", socket.id);
};

export const getSocket = () => socket;
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log("Socket disconnected");
  }
};
