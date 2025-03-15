import express, { type Request, type Response } from "express";
import User from "../models/user";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const router = express.Router();

router.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

router.post("/login", async (req: Request, res: Response): Promise<any> => {
  console.log("Login request received", {
    auth: req.headers.authorization
      ? "Bearer token present"
      : "No bearer token",
    bodyKeys: Object.keys(req.body),
    userId: req.body.user?.id,
    userEmail: req.body.user?.email,
    provider: req.body.provider,
  });

  try {
    const token =
      req.body.token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.substring(7)
        : null);

    if (!token) {
      console.log("No token provided in request");
      return res.status(400).json({ error: "No token provided" });
    }

    const { user } = req.body;

    if (!user || !user.id || !user.email) {
      console.log("Invalid user data:", user);
      return res.status(400).json({ error: "User data is missing" });
    }

    const { id: supabase_id, email, user_metadata } = user;
    const name = user_metadata?.full_name || user_metadata?.name || "Unknown";
    const picture = user_metadata?.avatar_url || user_metadata?.picture || "";
    const provider = req.body.provider || "oauth";

    console.log("Looking for existing user with supabase_id:", supabase_id);
    let existingUser = await User.findOne({ supabase_id });

    if (!existingUser) {
      console.log("Creating new user:", { supabase_id, email, name, provider });
      existingUser = await User.create({
        supabase_id,
        email,
        name,
        image: picture,
        provider,
      });
      console.log("New user created with ID:", existingUser._id);
    } else {
      console.log("Existing user found:", existingUser._id);
      (existingUser as any).name = name;
      (existingUser as any).image = picture;
      existingUser.provider = provider;
      await existingUser.save();
      console.log("Existing user updated");
    }

    res.status(200).json({ user: existingUser });
  } catch (error) {
    console.error("Error processing login:", error);
    res.status(500).json({
      error: "Server error during login",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Add a test endpoint to verify API connectivity
router.get("/test", (req: Request, res: Response) => {
  res.status(200).json({ message: "Auth API is working" });
});

export default router;
