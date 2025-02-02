export interface PaymentOrder {
  id: number;
  professionalId: number;
  servicesId: number;
  date: string[]; // A data permanece como um array de strings
  userId: number;
  paymentId: string;
  paymentStatus: string; // Atualizado para refletir o status de pagamento
  statusDetail: string; // Detalhes sobre o status do pagamento
  approvedAt: string; // Data da aprovação
  transactionAmount: number; // Valor total da transação
  netReceivedAmount: number; // Valor líquido recebido
  feeAmount: number; // Taxa cobrada
  paymentMethod: string; // Método de pagamento
  installments: number; // Número de parcelas
  externalRef: string; // Referência externa
  description: string; // Descrição do serviço ou transação
  payerId: string; // ID do pagador
  payerEmail: string; // E-mail do pagador
  payerCPF: string; // CPF do pagador
  orderId: string; // ID do pedido
  
  professional: {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
    specialty: string;
    createdAt: string;
    image: string;
    updatedAt: string;
    googleId: string;
  };

  service: {
    id: number;
    name: string;
    time: string;
    createdAt: string;
    updatedAt: string;
    price: string; 
  };
}
