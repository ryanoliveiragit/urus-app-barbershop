import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// Desabilita o body parsing automático para verificar a assinatura
export const dynamic = "force-dynamic"

async function getRawBody(req: NextRequest): Promise<Buffer> {
  const arr = await req.arrayBuffer()
  return Buffer.from(arr)
}

function verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
  const secret = process.env.ASAAS_WEBHOOK_SECRET || ""
  const computedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex")

  return crypto.timingSafeEqual(Buffer.from(computedSignature), Buffer.from(signature))
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await getRawBody(req)
    const signature = req.headers.get("asaas-signature")

    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 })
    }

    const event = JSON.parse(rawBody.toString())

    // Log do evento recebido
    console.log("Evento Asaas recebido:", {
      event: event.event,
      payment: event.payment,
    })

    // Processa diferentes tipos de eventos
    switch (event.event) {
      case "PAYMENT_RECEIVED":
        // Lógica para pagamento recebido
        break
      case "PAYMENT_UPDATED":
        // Lógica para pagamento atualizado
        break
      // Adicione outros casos conforme necessário
    }

    return NextResponse.json({ message: "Webhook processado com sucesso" }, { status: 200 })
  } catch (error) {
    console.error("Erro no webhook:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

