import { Request, Response } from "express";
import { io } from "../..";

export class WebhookController {
  static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;

      // Verifica se o corpo da requisição está vazio
      if (!body || Object.keys(body).length === 0) {
        console.log("⚠️ Webhook recebido sem dados.");
        res.status(400).json({ error: "Dados do webhook estão vazios." });
        return;
      }

      // Exibe o conteúdo do webhook no console
      console.log("🔹 Webhook recebido:", JSON.stringify(body, null, 2));

      // Envia os dados para o frontend via WebSocket
      io.emit("webhookEvent", body);

      // Responde ao webhook com sucesso
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("❌ Erro ao processar webhook:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
