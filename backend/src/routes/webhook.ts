import express from 'express';
import { WebhookController } from '../resources/webhook/controller';

const router = express.Router();

router.post('/', express.json({ type: 'application/json' }), WebhookController.handleWebhook);

export default router;

