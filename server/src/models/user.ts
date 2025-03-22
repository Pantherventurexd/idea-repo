import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    supabase_id: { type: String, required: true, unique: true }, 
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
