import { Request, Response } from "express";
import { WebSocketServer, WebSocket } from "ws";

export class WebhookController {
  private static wss: WebSocketServer | null = null;

  // Método para configurar o WebSocket Server
  static setWebSocketServer(wssInstance: WebSocketServer) {
    WebhookController.wss = wssInstance;
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

      if (WebhookController.wss) {
        WebhookController.wss.clients.forEach((client: WebSocket) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ event: "webhookEvent", data: body }));
          }
        });
      } else {
        console.warn("⚠️ WebSocketServer não configurado.");
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("❌ Erro ao processar webhook:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
}
