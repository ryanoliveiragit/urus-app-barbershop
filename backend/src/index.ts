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

const app = express();
const server = http.createServer(app); // Criando um servidor HTTP
const io = new Server(server, {
  cors: { origin: "*" }, // Permite conexões de qualquer origem
});

app.use(cors());
app.use(express.json());

// Expor `io` para ser usado nos controllers
export { io };

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
