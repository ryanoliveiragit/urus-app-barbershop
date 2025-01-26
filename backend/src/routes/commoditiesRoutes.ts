import express from "express";
import { createNewCommodity, getCommodities } from "../resources/commodities/controller";

const router = express.Router();

router.get("/", getCommodities);
router.post("/", createNewCommodity);

export default router;