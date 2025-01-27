import express from "express";
import {
  createNewAgendament,
  getAgendaments,
} from "../resources/agendament/controller";
import { authenticateJWT } from "../resources/auth/authMiddleware";
const router = express.Router();

router.get("/", authenticateJWT, getAgendaments);
router.post("/", authenticateJWT, createNewAgendament);

export default router;
