import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const ASAAS_WEBHOOK_SECRET = "$aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmU5YWNhYjY5LWRkMzYtNDNjZS04N2VlLTUxMjZlZjIxZjI1ZDo6JGFhY2hfMWJlODBiMTItMWRhMi00ZjA5LTliYzctMzQ0NjM2ZjQyZmFi";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("Asaas-Signature");

    if (!signature) {
      return NextResponse.json({ error: "Assinatura não encontrada" }, { status: 401 });
    }

    const hash = crypto
      .createHmac("sha256", ASAAS_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
    }

    const event = JSON.parse(body);
    console.log("Webhook recebido:", event);

    // Criação do evento para ser enviado via SSE
    if (event.event === "PAYMENT_RECEIVED") {
      console.log("Pagamento recebido:", event.payment);
      // Enviar evento para o frontend
      const sseEvent = `data: ${JSON.stringify(event)}\n\n`;

      // Você precisa configurar um endpoint SSE para enviar esse dado
      // Exemplo de resposta SSE
      return new NextResponse(sseEvent, {
        status: 200,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 500 });
  }
}
