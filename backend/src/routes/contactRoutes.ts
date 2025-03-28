
import express from "express"
import { authenticateJWT } from "../resources/auth/authMiddleware"
import { sendCode, verifyPhone, contactOption } from "../resources/contact/controller"

const router = express.Router()

router.post("/send-sms", sendCode)
router.post("/verify-phone", verifyPhone)
router.post("/set-contact-option", contactOption)

export default router