import mongoose from "mongoose";
import { MONGODB_URI } from "./constants";

const mongoURI = MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
