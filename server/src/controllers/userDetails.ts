import { Request, Response } from "express";
import UserDetails from "../models/userDetails";

export const createUserDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId, name, occupation, fieldOfInterest, avatar, college } =
    req.body;

  if (!userId || !name || !occupation || !fieldOfInterest || !avatar) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newUserDetails = new UserDetails({
      userId,
      name,
      occupation,
      fieldOfInterest,
      avatar,
      college: occupation === "Student" ? college : undefined,
    });

    await newUserDetails.save();

    return res.status(201).json({
      message: "User details saved successfully",
      data: newUserDetails,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getAllUserDetails = async (req: any, res: any): Promise<any> => {
  try {
    const userDetails = await UserDetails.find();

    if (!userDetails || userDetails.length === 0) {
      return res.status(404).json({ message: "No user details found" });
    }

    return res.status(200).json({
      message: "User details fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
