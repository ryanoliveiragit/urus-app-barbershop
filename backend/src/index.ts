import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import webhookRoutes from "./routes/webhook";
import { WebhookController } from "./resources/webhook/controller";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// ⚡ Define o WebSocket no Controller ANTES de usar as rotas
WebhookController.setWebSocketServer(wss);

wss.on("connection", (ws) => {
  console.log("⚡ Novo cliente WebSocket conectado!");

  ws.on("message", (message) => {
    console.log("📩 Mensagem recebida:", message.toString());
    ws.send("📬 Mensagem recebida com sucesso!" + message);
  });

  ws.on("close", () => {
    console.log("❌ Cliente WebSocket desconectado.");
  });
});

app.use(cors());
app.use(express.json());

// ⚡ Registre as rotas DEPOIS de configurar o WebSocket
app.use("/webhook", webhookRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
