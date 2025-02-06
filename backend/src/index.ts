import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import agendamentRoutes from "./routes/agendamentRoutes";
import subscriptionsRoutes from "./routes/subscriptionsRoutes";
import commoditiesRoutes from "./routes/commoditiesRoutes";
import servicesRoutes from "./routes/servicesRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import paymentOrderRoutes from "./routes/paymentOrderRoutes";
import webhookRoutes from "./routes/webhook";
import { WebhookController } from "./resources/webhook/controller";
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Configura o WebSocket no Controller
WebhookController.setWebSocketServer(wss);

wss.on("connection", (ws) => {
  console.log("⚡ Novo cliente WebSocket conectado!");

  ws.on("message", (message) => {
    console.log("📩 Mensagem recebida:", message.toString());
  });

  ws.on("close", () => {
    console.log("❌ Cliente WebSocket desconectado.");
  });
});

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/services", servicesRoutes);
app.use("/agendament", agendamentRoutes);
app.use("/subscription", subscriptionsRoutes);
app.use("/commodity", commoditiesRoutes);
app.use("/auth", authRoutes);
app.use("/orders", paymentOrderRoutes);
app.use("/webhook", webhookRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
