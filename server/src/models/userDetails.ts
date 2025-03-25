import { Schema, model } from "mongoose";

const userDetailsSchema = new Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    occupation: { type: String, required: true },
    fieldOfInterest: { type: [String], required: true },
    avatar: { type: String, required: true },
    college: { type: String, required: false },
  },
  { timestamps: true }
);

const UserDetails = model("UserDetails", userDetailsSchema);

export default UserDetails;
