import express from "express";
import {
  createNewAgendament,
  getAgendaments,
  getUserAgendaments,
} from "../resources/agendament/controller";
import { authenticateJWT } from "../resources/auth/authMiddleware";
const router = express.Router();

router.get("/", authenticateJWT, getAgendaments);
router.get("/user/:userId", authenticateJWT, getUserAgendaments);
router.post("/", authenticateJWT, createNewAgendament);

export default router;
