import express from "express";
import cors from "cors";
import { PORT } from "./config/constants";
import {
  userRouter,
  ideaRouter,
  conversationRouter,
  detailsRouter,
} from "./routes";
import connectDB from "./config/db";
import { initSocket } from "./socket";
import http from "http";
import messageRoutes from "./routes/message";

const app = express();
const server = http.createServer(app);

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/ideas", ideaRouter);
app.use("/api/user-details", detailsRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/messages", messageRoutes);

const io = initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
