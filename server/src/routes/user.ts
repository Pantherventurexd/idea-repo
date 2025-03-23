import { Router } from "express";
import { createUser } from "../controllers/authController";

const router = Router();

router.post("/create_user", createUser);


export default router;
