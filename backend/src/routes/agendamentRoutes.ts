import express from "express";
import {
  createNewAgendament,
  getAgendaments,
} from "../resources/agendament/controller";
const router = express.Router();

router.get("/", getAgendaments);
router.post("/", createNewAgendament);

export default router;
