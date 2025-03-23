import express from "express";
import cors from "cors";
import { PORT } from "./config/constants";
import { userRouter, ideaRouter } from "./routes";
import connectDB from "./config/db";

const app = express();

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
