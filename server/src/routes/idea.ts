import { Router } from "express";
import { submitIdea, getIdeas, getSimilarIdeas } from "../controllers/idea";
import { swipeInterested } from "../controllers/swipe";

const router = Router();

router.post("/submit-idea", submitIdea);
router.get("/get-ideas", getIdeas);
router.post("/swipe-right", swipeInterested as any);
router.post("/recommend-idea", getSimilarIdeas);
export default router;
