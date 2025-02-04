import { Request, Response } from 'express';
import { WebhookPayload } from '../../types/webhook';
import { WebhookService } from './services';


export class WebhookController {
  static async handleWebhook(req: Request, res: Response) {
    try {
      const body: WebhookPayload = req.body;

      switch (body.event) {
        case 'PAYMENT_CREATED':
          WebhookService.createPayment(body.payment);
          break;
        case 'PAYMENT_RECEIVED':
          WebhookService.receivePayment(body.payment);
          break;
        default:
          WebhookService.handleUnknownEvent(body.event);
      }

      // Resposta de sucesso
      res.status(200).json({ received: true });
    } catch (error) {
      console.error('Erro ao processar webhook:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}