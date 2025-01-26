import express from "express";
import { createNewSubscription, getSubscriptions } from "../resources/subscriptions/controller";

const router = express.Router();

router.get("/", getSubscriptions);
router.post("/", createNewSubscription);

export default router;