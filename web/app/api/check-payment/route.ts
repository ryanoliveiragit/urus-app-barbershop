import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const payment_id = searchParams.get("payment_id")

  if (!payment_id) {
    return NextResponse.json({ error: "payment_id é obrigatório" }, { status: 400 })
  }

  try {
    const mercadoPagoResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${payment_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        },
      }
    )

    if (!mercadoPagoResponse.ok) {
      throw new Error(`Erro ao buscar pagamento: ${mercadoPagoResponse.statusText}`)
    }

    const paymentData = await mercadoPagoResponse.json()
    return NextResponse.json({ status: paymentData.status, paymentData })
  } catch (error) {
    console.error("Erro ao consultar pagamento:", error)
    return NextResponse.json({ error: "Erro interno ao consultar pagamento" }, { status: 500 })
  }
}
