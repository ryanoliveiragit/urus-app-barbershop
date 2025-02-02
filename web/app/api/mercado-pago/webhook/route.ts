import { NextResponse } from "next/server";
import { handleMercadoPagoPayment } from "@/app/server/mercado-pago/handle-payment";
import  { verifyMercadoPagoSignature } from "@/lib/mercado-pago";

export async function POST(request: Request) {
  try {
    verifyMercadoPagoSignature(request);

    const body = await request.json();
    console.log("📩 Webhook recebido:", body);

    const { type, data } = body;

    if (type === "payment") {
      const paymentId = data.id;
      console.log("🔍 Buscando pagamento com ID:", paymentId);

      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar pagamento: ${response.statusText}`);
      }

      const paymentData = await response.json();
      console.log("🧾 Dados do pagamento:", paymentData);

      // Verifica se o pagamento foi aprovado
      if (
        paymentData.status === "approved" || // Pagamento por Cartão
        paymentData.status === "pending_waiting_payment" || // Pagamento pendente (Pix ainda não pago)
        paymentData.date_approved !== null // Pix aprovado
      ) {
        console.log("✅ Pagamento APROVADO:", paymentData);
        await handleMercadoPagoPayment(paymentData);
      } else {
        console.log("⚠️ Pagamento ainda não aprovado:", paymentData.status);
      }
    } else {
      console.log("📌 Evento ignorado:", type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
