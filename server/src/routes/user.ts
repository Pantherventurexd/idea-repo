import { Router } from "express";
import { createUser } from "../controllers/auth";

const router = Router();

router.post("/create_user", createUser);


export default router;
