import { Request, Response } from "express";
import Idea from "../models/idea";
import User from "../models/user";
import { Types } from "mongoose";

export const swipeInterested = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId, ideaId } = req.body;

  if (!userId || !ideaId) {
    return res.status(400).json({ message: "userId and ideaId are required" });
  }
  console.log(ideaId, userId, "yooooo");
  try {
    const user = await User.findOne({ supabase_id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedIdea = await Idea.findByIdAndUpdate(
      ideaId,
      {
        $addToSet: {
          interested_users: {
            email: user.email,
            userId: user._id.toString(),
            supabase_id: user.supabase_id
          },
        },
      },
      { new: true }
    );

    if (!updatedIdea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    return res.status(200).json({ message: "Successfully expressed interest" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
