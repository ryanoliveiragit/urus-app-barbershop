import express from "express";
import { getServices } from "../resources/services/controller";

const router = express.Router();

router.get("/", getServices);

export default router;