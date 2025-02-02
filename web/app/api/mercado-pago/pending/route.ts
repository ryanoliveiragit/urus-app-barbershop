import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient from "@/lib/mercado-pago";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("payment_id");
  const testeId = searchParams.get("external_reference");

  if (!paymentId || !testeId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const payment = new Payment(mpClient);
    const paymentData = await payment.get({ id: paymentId });

    if (paymentData.status === "approved" || paymentData.date_approved !== null) {
      return NextResponse.redirect(new URL(`?payment_id=${paymentId}`, request.url));
    }

    return NextResponse.redirect(new URL("/pagamento/pendente", request.url));
  } catch (error) {
    console.error("Erro ao buscar pagamento:", error);
    return NextResponse.redirect(new URL("/pagamento/falha", request.url));
  }
}
