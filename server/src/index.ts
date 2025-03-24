import express from "express";
import cors from "cors";
import { PORT } from "./config/constants";
import { userRouter, ideaRouter } from "./routes";
import connectDB from "./config/db";
import { initSocket } from './socket';
import http from 'http';


const app = express();
const server = http.createServer(app);

connectDB();

app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3000", // Specify the frontend URL here
  })
);

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/ideas", ideaRouter);

initSocket(server);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
