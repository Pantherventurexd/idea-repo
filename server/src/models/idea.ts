import mongoose, { Schema, Document } from "mongoose";

interface IIdea extends Document {
  title: string;
  problem: string;
  solution: string;
  market: string;
  monetization: string;
  industry: string;
  submittedAt: Date;
  accessToken: string;
}

const IdeaSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    problem: { type: String, required: true },
    solution: { type: String, required: true },
    market: { type: String, required: true },
    monetization: { type: String, required: true },
    industry: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    accessToken: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Idea = mongoose.model<IIdea>("Idea", IdeaSchema);
export default Idea;
