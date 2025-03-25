import { Router } from "express";
import { createUser, getUsersByIds, getUsersBySupabaseIds } from "../controllers/auth";
const router = Router();

router.post("/create_user", createUser);
router.post("/get-user", getUsersByIds);
router.post("/get-user-detail", getUsersBySupabaseIds)

export default router;
