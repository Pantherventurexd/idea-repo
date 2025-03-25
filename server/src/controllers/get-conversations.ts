import { Request, Response } from "express";
import Conversation from "../models/conversation";

export const getConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.body.userId;
    const conversations = await Conversation.find({ participants: userId });
    res.status(200).json(conversations);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving conversations", error });
  }
};
