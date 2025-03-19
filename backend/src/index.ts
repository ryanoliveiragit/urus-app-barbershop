// server.ts
import express, { Application } from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Configuração de ambiente
dotenv.config();

// Importação de rotas
import agendamentRoutes from './routes/agendamentRoutes';
import subscriptionsRoutes from './routes/subscriptionsRoutes';
import commoditiesRoutes from './routes/commoditiesRoutes';
import contactRoutes from './routes/contactRoutes'
import servicesRoutes from './routes/servicesRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import paymentOrderRoutes from './routes/paymentOrderRoutes';
import pixRoutes from './routes/pixRoute';
import { WebhookController } from './resources/webhook/controller';

const app: Application = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usando HTTP
const server = http.createServer(app);

// Configuração do Socket.IO
const io = new Server(server, {
  cors: { 
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'] // Garantir que ambos transportes estão disponíveis
});

// Passa a instância do WebSocket para o Controller
WebhookController.setWebSocketServer(io);

// Evento de conexão WebSocket
io.on("connection", (socket) => {
  console.log(`⚡ Novo cliente WebSocket conectado! ID: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ Cliente WebSocket desconectado: ${socket.id}`);
  });
});

// Rota simples para verificar se o servidor está funcionando
app.get('/ping', (req, res) => {
  res.json({ message: 'pong', timestamp: new Date().toISOString() });
});

// Definição das rotas
app.use("/user", userRoutes);
app.use("/services", servicesRoutes);
app.use("/agendament", agendamentRoutes);
app.use("/subscription", subscriptionsRoutes);
app.use("/commodity", commoditiesRoutes);
app.use("/contact", contactRoutes);
app.use("/auth", authRoutes);
app.use("/orders", paymentOrderRoutes);
app.use("/pix", pixRoutes); // Rota para pagamentos PIX

// Rota para debug e listar todas as rotas registradas
app.get('/debug/routes', (req, res) => {
  const routes: {method: string; path: string}[] = [];
  
  function print(path: string, layer: any) {
    if (layer.route) {
      layer.route.stack.forEach((stack: any) => {
        const method = stack.method ? stack.method.toUpperCase() : 'ALL';
        routes.push({ method, path: path + (layer.route.path === '/' ? '' : layer.route.path) });
      });
    } else if (layer.name === 'router' && layer.handle.stack) {
      let routerPath = path;
      if (layer.regexp && layer.regexp.fast_slash !== true) {
        const match = layer.regexp.toString().match(/^\/\^(\\\/[^\\\/]*(?:\\\/[^\\\/]*)*)/)
        if (match) {
          routerPath = match[1].replace(/\\\//g, '/');
        }
      }
      layer.handle.stack.forEach((stackItem: any) => {
        print(routerPath, stackItem);
      });
    }
  }
  
  app._router.stack.forEach((layer: any) => {
    print('', layer);
  });
  
  res.json(routes);
});

// Middleware para capturar rotas não encontradas
app.use((req, res) => {
  console.log(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Socket.io disponível em http://localhost:${PORT}/socket.io`);
});