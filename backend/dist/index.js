"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const webhook_1 = __importDefault(require("./routes/webhook"));
const controller_1 = require("./resources/webhook/controller");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
// ⚡ Define o WebSocket no Controller ANTES de usar as rotas
controller_1.WebhookController.setWebSocketServer(wss);
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
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ⚡ Registre as rotas DEPOIS de configurar o WebSocket
app.use("/webhook", webhook_1.default);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
