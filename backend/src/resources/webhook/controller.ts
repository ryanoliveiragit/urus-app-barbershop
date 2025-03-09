// resources/webhook/controller.ts
import { Server } from 'socket.io';

interface PaymentInfo {
  id: string;
  externalId: string;
  amount: number;
  description: string;
  customerId: string;
  status: string;
  qrCode?: string;
  qrCodeBase64?: string;
  createdAt: Date;
}

export class WebhookController {
  private static webSocketServer: Server | null = null;

  static setWebSocketServer(io: Server): void {
    WebhookController.webSocketServer = io;
  }

  // Método para notificar pagamentos PIX aprovados
  static notifyPaymentApproved(paymentInfo: PaymentInfo): void {
    if (WebhookController.webSocketServer) {
      // Emite o evento para todos os clientes conectados
      WebhookController.webSocketServer.emit('payment_approved', {
        paymentId: paymentInfo.id,
        amount: paymentInfo.amount,
        description: paymentInfo.description,
        status: 'approved',
        timestamp: new Date()
      });

      console.log(`✅ Notificação de pagamento aprovado enviada para o paymentId: ${paymentInfo.id}`);
    } else {
      console.error('❌ WebSocket server não configurado!');
    }
  }

  // Outros métodos do seu WebhookController
  // ...
}