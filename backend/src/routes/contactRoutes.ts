
import express from "express"
import { authenticateJWT } from "../resources/auth/authMiddleware"
import { sendCode, verifyPhone, contactOption } from "../resources/contact/controller"

const router = express.Router()

// router.get("/",authenticateJWT, getUsers)
// PUT pra alterar o phone, PUT pra verificação do codigo, PUT pra setar o tipo de envio (phone, email, both)

export default router