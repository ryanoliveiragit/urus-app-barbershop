import express from "express"
import {authenticateJWT} from "../resources/auth/authMiddleware"
import { createNewUser, getUsers, getBarbers } from "../resources/users/controller"

const router = express.Router()

router.get("/",authenticateJWT, getUsers)
router.get("/barbers", authenticateJWT, getBarbers)
router.post("/", authenticateJWT, createNewUser)

export default router

