import {Router} from 'express'
import {login, signup} from '../resources/auth/controller'

const authRoutes:Router = Router()

authRoutes.post('/signup', signup)
authRoutes.post('/login', login)

export default authRoutes