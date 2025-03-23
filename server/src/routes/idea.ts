import { Router } from "express";
import {
  submitIdea,
  analyzeIdeaWithGemini,
} from "../controllers/ideaController";

const router = Router();

router.post("/submit-idea", submitIdea);

export default router;
