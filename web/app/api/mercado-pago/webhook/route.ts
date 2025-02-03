import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();

  console.log("Recebido Webhook:", data);

  if (data.event === "PAYMENT_RECEIVED") {
    console.log(`Pagamento confirmado para o cliente: ${data.payment.customer}`);
  }

  return NextResponse.json({ received: true });
}
