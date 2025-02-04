import { Request, Response } from "express";
import { io } from "../..";


export class WebhookController {
  static async handleWebhook(req: Request, res: Response) {
    try {
      const body = req.body;

      console.log("🔹 Webhook recebido:", JSON.stringify(body, null, 2));

      // Enviar os dados para o frontend via WebSocket
      io.emit("webhookEvent", body);

      // Responder ao webhook com sucesso
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("❌ Erro ao processar webhook:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
