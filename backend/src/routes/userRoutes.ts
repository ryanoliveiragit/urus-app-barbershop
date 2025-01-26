import express from "express"
import authenticateJWT from "../resources/auth/authMiddleware"
import { createNewUser, getUsers, getBarbers } from "../resources/users/controller"

const router = express.Router()

router.get("/", authenticateJWT, getUsers)
router.get("/",  getUsers)
router.get("/barbers",  getBarbers)
router.post("/", createNewUser)

export default router

