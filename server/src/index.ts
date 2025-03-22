import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // Importing cors
import userRoute from "./routes/userRoute";

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
  .connect(
    "mongodb+srv://likhithreddy150:12jVCeYLJ0TmeTw1@cluster0.3fmhl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error", err));

app.use("/api", userRoute);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
