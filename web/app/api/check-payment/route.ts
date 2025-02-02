import { NextRequest, NextResponse } from "next/server"
import { Payment } from "mercadopago"
import mpClient from "@/lib/mercado-pago"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const paymentId = searchParams.get("payment_id")

  if (!paymentId) {
    return NextResponse.json({ error: "payment_id é obrigatório" }, { status: 400 })
  }

  try {
    const payment = new Payment(mpClient)
    const paymentData = await payment.get({ id: paymentId })

    console.log("Dados do pagamento:", paymentData)

    return NextResponse.json({ 
      status: paymentData.status,
      isApproved: paymentData.status === "approved" || paymentData.date_approved !== null
    })
  } catch (error) {
    console.error("Erro ao consultar pagamento:", error)
    return NextResponse.json({ error: "Erro interno ao consultar pagamento" }, { status: 500 })
  }
}