import express from "express";
import {
  cancelAgendaments,
  createNewAgendament,
  getAgendaments,
  getUserAgendaments,
} from "../resources/agendament/controller";
import { authenticateJWT } from "../resources/auth/authMiddleware";
const router = express.Router();

router.get("/", authenticateJWT, getAgendaments);
router.post("/", authenticateJWT, createNewAgendament);
router.post("/cancel", authenticateJWT, cancelAgendaments)

router.get("/user/:userId", authenticateJWT, getUserAgendaments);

export default router;
