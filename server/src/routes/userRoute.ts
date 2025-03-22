import { Router } from "express";
import { createUser, submitIdea } from "../controllers/authController";

const router = Router();

router.post("/create_user", createUser);
router.post("/submit-idea", submitIdea);

export default router;
