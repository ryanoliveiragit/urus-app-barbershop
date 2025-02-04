import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient from "@/lib/mercado-pago";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("payment_id");

  if (!paymentId) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const payment = new Payment(mpClient);
    const paymentData = await payment.get({ id: paymentId });

    // URL base para redirecionamento
    const baseUrl = "https://urus-app-barbershop-frontend.vercel.app";
    const redirectUrl = `${baseUrl}?payment_id=${paymentId}`;

    // Verifica se o pagamento foi aprovado
    if (paymentData.status === "approved" || paymentData.date_approved !== null) {
      return NextResponse.redirect(redirectUrl);
    }

    // Caso o pagamento não esteja aprovado, redireciona de qualquer forma
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Erro ao buscar pagamento:", error);
    const baseUrl = "https://urus-app-barbershop-frontend.vercel.app";
    const redirectUrl = `${baseUrl}?payment_id=${paymentId}`;
    return NextResponse.redirect(redirectUrl);
  }
}