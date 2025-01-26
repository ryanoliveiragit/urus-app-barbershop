import express from "express";
import { getServices, createNewServices } from "../resources/services/controller";

const router = express.Router();

router.get("/", getServices);
router.post("/", createNewServices);

export default router;