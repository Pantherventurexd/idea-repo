import { Request, Response } from "express";
import Conversation from "../models/conversation";
import User from "../models/user";
import mongoose from "mongoose";

export const startConversation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, otherUserId } = req.body;

    if (!userId || !otherUserId) {
      res.status(400).json({ error: "User IDs are required." });
      return;
    }

    // Find MongoDB users by their Supabase IDs
    const user = await User.findOne({ supabase_id: userId });
    const otherUser = await User.findOne({ supabase_id: otherUserId });

    if (!user || !otherUser) {
      res.status(404).json({ error: "One or both users not found." });
      return;
    }

    const userObjectId = user._id;
    const otherUserObjectId = otherUser._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [userObjectId, otherUserObjectId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [userObjectId, otherUserObjectId],
      });
      await conversation.save();
    }

    res.status(200).json({ conversationId: conversation._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
