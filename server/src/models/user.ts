import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    supabase_id: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: { type: String, default: "Unknown" },
    image: { type: String, default: "" },
    provider: { 
      type: String, 
      enum: ["google", "github", "twitter", "oauth"],
      default: "oauth" 
    },
    created_at: { type: Date, default: Date.now }
  });

const User = mongoose.model("User", UserSchema);

export default User;
