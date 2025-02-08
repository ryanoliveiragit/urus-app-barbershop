import { Server } from "socket.io";
import { Request, Response } from "express";

class WebhookController {
  private static io: Server;

  static setWebSocketServer(io: Server) {
    this.io = io;
  }

  static handleWebhook(req: Request, res: Response) {
    try {
      console.log("📩 Webhook recebido:", req.body);

      // Envia o evento para os clientes WebSocket conectados
      this.io.emit("webhookEvent", req.body);

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("❌ Erro ao processar webhook:", error);
      res.status(500).json({ error: "Erro ao processar webhook" });
    }
  }
}

export { WebhookController };
