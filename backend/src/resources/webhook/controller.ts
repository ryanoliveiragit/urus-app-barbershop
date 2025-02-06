import { Request, Response } from "express";
import { WebSocketServer } from "ws";

export class WebhookController {
  private static wss: WebSocketServer;

  // Método para configurar o WebSocketServer na inicialização do app
  static setWebSocketServer(wssInstance: WebSocketServer) {
    this.wss = wssInstance;
  }

  static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const body = req.body;

      if (!body || Object.keys(body).length === 0) {
        console.log("⚠️ Webhook recebido sem dados.");
        res.status(400).json({ error: "Dados do webhook estão vazios." });
        return;
      }

      console.log("🔹 Webhook recebido:", JSON.stringify(body, null, 2));

      // Verificar se o WebSocketServer está configurado
      if (this.wss) {
        // Enviar dados para todos os clientes conectados via WebSocket
        this.wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({ event: "webhookEvent", data: body }));
          }
        });
      } else {
        console.warn("⚠️ WebSocketServer não configurado.");
      }

      // Enviar resposta para o frontend **apenas uma vez**
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("❌ Erro ao processar webhook:", error);
      // Garantir que não enviamos uma resposta novamente
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
}
