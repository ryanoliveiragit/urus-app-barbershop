import { Payment } from "../../types/webhook";


export class WebhookService {
  static createPayment(payment: Payment) {
    console.log('Pagamento criado:', payment);
    // Lógica para criar um pagamento no banco de dados, etc.
  }

  static receivePayment(payment: Payment) {
    console.log('Pagamento recebido:', payment);
    // Lógica para processar um pagamento recebido.
  }

  static handleUnknownEvent(event: string) {
    console.log(`Evento desconhecido recebido: ${event}`);
  }
}