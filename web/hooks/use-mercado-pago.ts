import { useEffect } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useRouter } from "next/navigation";

interface CheckoutData {
  testeId: string;
  userEmail: string | null;
  items: unknown[];
}

export const useMercadoPago = () => {
  const router = useRouter();

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY!);
  }, []);

  async function createMercadoPagoCheckout(checkoutData: CheckoutData) {
    try {
      console.log(
        "Iniciando checkout do Mercado Pago com os dados:",
        checkoutData
      );

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

      const responseText = await response.text();
      console.log("Resposta bruta da API:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error("Falha ao analisar a resposta JSON:", e);
        throw new Error("A resposta da API não é um JSON válido");
      }

      if (!data || !data.initPoint) {
        console.error("Resposta da API não contém initPoint:", data);
        throw new Error("Resposta da API inválida");
      }

      console.log("Redirecionando para:", data.initPoint);
      router.push(data.initPoint);
      return data.initPoint;
    } catch (error) {
      console.error("Erro durante o checkout do Mercado Pago:", error);

      throw error;
    }
  }

  return { createMercadoPagoCheckout };
};

export default useMercadoPago;
