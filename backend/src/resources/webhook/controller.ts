import { Request, Response } from 'express';

export class WebhookController {
  static async handleWebhook(req: Request, res: Response) {
    try {
      const body = req.body; // Recebe todo o objeto do webhook
      
      console.log('🔹 Webhook recebido:', JSON.stringify(body, null, 2)); // Exibe todo o objeto formatado

      // Responde que recebeu com sucesso
      res.status(200).json({ received: true, data: body });
    } catch (error) {
      console.error('❌ Erro ao processar webhook:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
