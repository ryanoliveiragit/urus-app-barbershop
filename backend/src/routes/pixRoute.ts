// routes/pixRoutes.ts
import express, { Router } from 'express';
import { PixController } from '../resources/pix/controller';

const router: Router = express.Router();

// Rota para gerar código PIX
router.post('/generate', (req, res) => PixController.generatePixCode(req, res));

// Rota para verificar status do pagamento
router.get('/status/:paymentId', (req, res) => PixController.checkPaymentStatus(req, res));

// Rota para receber webhook de confirmação de pagamento
router.post('/webhook', (req, res) => PixController.handleWebhook(req, res));

export default router;