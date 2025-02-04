export type WebhookEvent = 'PAYMENT_CREATED' | 'PAYMENT_RECEIVED' | 'UNKNOWN_EVENT';

export type Payment = {
  id: string;
  amount: number;
  status: string;
  // Adicione outros campos conforme necessário
};

export type WebhookPayload = {
  event: WebhookEvent;
  payment: Payment;
};