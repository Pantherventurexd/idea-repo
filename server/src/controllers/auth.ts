import { Request, Response } from "express";
import { supabase } from "../config/supabaseClient";
import { ObjectId } from "mongodb";

import User from "../models/user";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;
  const authHeader = req.headers.authorization;

  // Get token from Authorization header
  const accessToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

  if (!email || !accessToken) {
    res.status(400).json({ message: "Email and access token are required" });
    return;
  }

  try {
    // Use the token from the header
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      console.error("Supabase auth error:", error);
      res.status(401).json({ message: "Invalid access token" });
      return;
    }

    // Verify the email matches the authenticated user
    if (data.user.email !== email) {
      res
        .status(403)
        .json({ message: "Email does not match authenticated user" });
      return;
    }

    // Get the Supabase user ID
    const supabase_id = data.user.id;

    // Check if user already exists by email or supabase_id
    const user = await User.findOne({
      $or: [{ email }, { supabase_id }],
    });

    if (user) {
      res.status(200).json({ message: "User already exists" });
      return;
    }

    const newUser = new User({
      email,
      accessToken,
      supabase_id,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Server error during user creation:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const getUsersByIds = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userIds } = req.body;

  if (!Array.isArray(userIds) || userIds.length === 0) {
    res.status(400).json({ message: "User IDs must be provided as an array" });
    return;
  }

  try {
    // Check if IDs are Supabase UUIDs or MongoDB ObjectIds
    const query = userIds.some((id) => id.includes("-"))
      ? { supabase_id: { $in: userIds } } // Use supabase_id for UUID format
      : {
          _id: {
            $in: userIds
              .map((id) => {
                try {
                  return new ObjectId(id);
                } catch (error) {
                  return null;
                }
              })
              .filter((id) => id !== null),
          },
        };

    console.log("Looking for users with query:", query);
    const users = await User.find(query, "email");
    console.log("Found users:", users);

    const userDetails = users.map((user) => ({
      userId: user._id,
      email: user.email,
    }));

    res.status(200).json(userDetails);
  } catch (error) {
    console.error("Server error during fetching user details:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
