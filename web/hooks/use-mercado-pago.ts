import { useEffect } from "react"
import { initMercadoPago } from "@mercadopago/sdk-react"


interface CheckoutData {
  testeId: string
  userEmail: string | null
  items: unknown[]
}

// useMercadoPago.ts
export const useMercadoPago = () => {
  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!);
  }, []);

  async function createMercadoPagoCheckout(checkoutData: CheckoutData) {
    try {
      const response = await fetch("/api/mercado-pago/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();

      if (!data?.initPoint) {
        throw new Error("Resposta da API inválida");
      }

      return data; // Retorna os dados do checkout
    } catch (error) {
      console.error("Erro ao criar checkout:", error);
      throw error;
    }
  }

  return { createMercadoPagoCheckout };
};
export default useMercadoPago

