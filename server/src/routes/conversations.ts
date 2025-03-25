import { Router } from "express";
import { startConversation } from "../controllers/start-conversation";
import { getConversation } from "../controllers/get-conversations";

const router = Router();

router.post("/start-conversation", startConversation);
router.post("/get-conversation", getConversation);

export default router;
