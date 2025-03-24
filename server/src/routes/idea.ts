import { Router } from "express";
import { submitIdea, getIdeas, getSimilarIdeas, getDetailsFromIdea, getUserIdeas } from "../controllers/idea";
import { swipeInterested } from "../controllers/swipe";

const router = Router();

router.post("/submit-idea", submitIdea);
router.get("/get-ideas", getIdeas);
router.post("/swipe-right", swipeInterested as any);
router.post("/recommend-idea", getSimilarIdeas);
router.post("/get-idea", getDetailsFromIdea);
router.post("/get-user-ideas", getUserIdeas);
export default router;
