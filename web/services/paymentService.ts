import { PaymentOrder } from "@/@types/payment-order";

const API_URL = process.env.NEXT_PUBLIC_API_URL 

export class PaymentService {
    static async getPaymentOrders(email: string): Promise<PaymentOrder[]> {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), 
      });
  
      if (!response.ok) {
        throw new Error('Erro ao buscar ordens de pagamento');
      }
  
      return response.json();
    }
  }