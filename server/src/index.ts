import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/auth";

dotenv.config();

connectDB();

const app: Express = express();
const port = process.env.PORT;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server with MongoDB is running");
});

app.use("/api", apiRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err}`);
  process.exit(1);
});
