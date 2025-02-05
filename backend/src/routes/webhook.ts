import express from 'express';
import { WebhookController } from '../resources/webhook/controller';

const router = express.Router();

// Configura a rota POST para receber webhooks
router.post('/', express.json({ type: 'application/json' }), WebhookController.handleWebhook);

export default router;