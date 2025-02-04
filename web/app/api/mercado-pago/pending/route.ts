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

    const baseUrl = "https://urus-app-barbershop-frontend.vercel.app";
    const redirectUrl = `${baseUrl}?payment_id=${paymentId}`;

    if (paymentData.status === "approved" || paymentData.date_approved !== null) {
      return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error("Erro ao buscar pagamento:", error);
    const baseUrl = "https://urus-app-barbershop-frontend.vercel.app";
    const redirectUrl = `${baseUrl}?payment_id=${paymentId}`;
    return NextResponse.redirect(redirectUrl);
  }
}