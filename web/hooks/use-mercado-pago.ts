import { useEffect } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useRouter } from "next/navigation";

interface CheckoutData {
  testeId: string;
  userEmail: string | null;
  items: {
    id: string | boolean;
    name: string | boolean;
    description: string;
    price: number;
  }[];
  paymentMethods: {
    pix: {
      expirationDate: string;
    };
  };
}

export const useMercadoPago = () => {
  const router = useRouter();

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!);
  }, []);

  async function createMercadoPagoCheckout(checkoutData: CheckoutData) {
    try {
      console.log("Iniciando checkout do Mercado Pago com os dados:", checkoutData);

      const response = await fetch("/api/mercado-pago/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !data.initPoint || !data.preferenceId) {
        throw new Error("Resposta da API inválida");
      }

      console.log("Redirecionando para:", data.initPoint);
      router.push(data.initPoint);
      startPolling(data.preferenceId);
      return data.initPoint;
    } catch (error) {
      console.error("Erro durante o checkout do Mercado Pago:", error);
      throw error;
    }
  }

  async function checkPaymentStatus(preferenceId: string) {
    try {
      const response = await fetch(`/api/mercado-pago/payment-status?preferenceId=${preferenceId}`);
      if (!response.ok) return null;

      const data = await response.json();
      return data.status;
    } catch (error) {
      console.error("Erro ao verificar status do pagamento:", error);
      return null;
    }
  }

  function startPolling(preferenceId: string) {
    const interval = setInterval(async () => {
      const status = await checkPaymentStatus(preferenceId);
      console.log("Status do pagamento:", status);

      if (status === "approved") {
        clearInterval(interval);
        router.push("/");
      }
    }, 3000);
  }

  return { createMercadoPagoCheckout };
};

export default useMercadoPago;
