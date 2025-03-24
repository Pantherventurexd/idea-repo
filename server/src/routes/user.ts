import { Router } from "express";
import { createUser, getUsersByIds } from "../controllers/auth";
const router = Router();

router.post("/create_user", createUser);
router.post("/get-user", getUsersByIds);

export default router;
