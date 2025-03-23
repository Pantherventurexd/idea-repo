import { Router } from "express";
import { createUser, submitIdea } from "../controllers/authController";
import { getSimilarIdeas } from "../controllers/ideaController";
const router = Router();

router.post("/create_user", createUser);
router.post("/submit-idea", submitIdea);
router.post("/recommend-idea", getSimilarIdeas);

export default router;
