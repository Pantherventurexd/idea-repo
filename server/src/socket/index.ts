import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

export const initSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*", // Update with your frontend URL in production
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('message', (data) => {
      console.log('Message received:', data);
      io.emit('message', data); // Broadcast to all
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};
