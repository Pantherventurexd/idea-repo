import mongoose, { Schema, Document } from "mongoose";

interface IIdea extends Document {
  title: string;
  problem: string;
  solution: string;
  market: string;
  monetization: string;
  industry: string;
  submittedAt: Date;
  userId: string;
  plagiarism_score?: number | string;
  uniqueness_score?: number | string;
  feasibility_score?: number | string;
  success_score?: number | string;
  existing_startups?: { name: string; website: string }[];
  competitors?: { name: string; website: string }[];
  business_presence?: Record<string, any>;
  final_score?: string;
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
    userId: { type: String, ref: "User", required: true },
    plagiarism_score: { type: Schema.Types.Mixed },
    uniqueness_score: { type: Schema.Types.Mixed },
    feasibility_score: { type: Schema.Types.Mixed },
    success_score: { type: Schema.Types.Mixed },
    final_score: { type: String, required: true },
    existing_startups: [
      {
        name: { type: String, required: true },
        website: { type: String, required: true },
      },
    ],
    competitors: [
      {
        name: { type: String, required: true },
        website: { type: String, required: true },
      },
    ],
    business_presence: { type: Object },
  },
  {
    timestamps: true,
  }
);

const Idea = mongoose.model<IIdea>("Idea", IdeaSchema);
export default Idea;
