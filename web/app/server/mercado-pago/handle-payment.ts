import "server-only";

import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  const metadata = paymentData.metadata;
 
    console.log("testeId userEmail", metadata)
  // Faz alguma ação aqui - manda email pro usuario, libera acesso, erc.

  return;
}