import { Router } from "express";
import {
  createUserDetails,
  getAllUserDetails,
} from "../controllers/userDetails";

const router = Router();

router.post("/user-details", createUserDetails);
router.get("/user-details", getAllUserDetails);

export default router;
