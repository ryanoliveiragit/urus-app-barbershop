import express from 'express';
import { login, signup } from '../resources/auth/controller'
import { googleAuth } from '../resources/auth/services';


const router = express.Router();

router.post('/', login);
router.post('/', signup);
router.post('/google', googleAuth);

export default router;