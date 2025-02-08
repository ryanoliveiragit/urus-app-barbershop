import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
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

// Configuração do Socket.IO
const io = new Server(server, {
  cors: { origin: "*" },
});

// Passa a instância do WebSocket para o Controller
WebhookController.setWebSocketServer(io);

// Evento de conexão WebSocket
io.on("connection", (socket) => {
  console.log("⚡ Novo cliente WebSocket conectado!");

  socket.on("disconnect", () => {
    console.log("❌ Cliente WebSocket desconectado.");
  });
});

app.use(cors());
app.use(express.json());

// Definição das rotas
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
