import express from "express";
import {
  cancelAgendaments,
  createNewAgendament,
  getAgendaments,
  getUserAgendaments,
} from "../resources/agendament/controller";
import { authenticateJWT } from "../resources/auth/authMiddleware";
const router = express.Router();

router.get("/", getAgendaments);
router.post("/", createNewAgendament);
router.post("/cancel", cancelAgendaments)

router.get("/user/:userId", authenticateJWT, getUserAgendaments);

export default router;
