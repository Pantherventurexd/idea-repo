import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // Importing cors
import userRoute from "./routes/userRoute";
import { PORT, MONGO_URI } from "./config/constants";
const app = express();

// Enable CORS for all origins
app.use(cors());

// Or if you want to allow only localhost:3000 (frontend origin), use:
app.use(
  cors({
    origin: "http://localhost:3000", // Specify the frontend URL here
  })
);

app.use(express.json());

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error", err));

app.use("/api", userRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
