import mongoose from "mongoose";

const mongoURI =
  "mongodb+srv://likhithreddy150:12jVCeYLJ0TmeTw1@cluster0.3fmhl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
