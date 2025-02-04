"use client"
import React, { useEffect } from 'react';

const PixPayment = () => {
  useEffect(() => {
    const eventSource = new EventSource('/api/pix'); // Endpoint SSE

    eventSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      console.log("Evento recebido do Webhook:", data);

      if (data.event === "PAYMENT_RECEIVED") {
        console.log("Pagamento recebido:", data.payment);
        // Aqui você pode atualizar o estado ou exibir um alerta
      }
    };

    eventSource.onerror = function (error) {
      console.error("Erro no evento SSE:", error);
    };

    return () => {
      eventSource.close(); // Fechar a conexão quando o componente for desmontado
    };
  }, []);

  return (
    <div>
      <h1>Pagamento via PIX</h1>
      <p>Verifique o console para os eventos recebidos do webhook.</p>
    </div>
  );
};

export default PixPayment;
