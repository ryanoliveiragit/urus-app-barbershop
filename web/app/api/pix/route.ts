import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const ASAAS_WEBHOOK_SECRET = "$aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OjNmYjhjNGJhLTcxODgtNGQ5NC1hNzQ2LWI5NTgwZmI5YTc3ZTo6JGFhY2hfMTlmMWQyOTItYWJmNC00YjMxLWI2YzMtYjk1NzlhNGExNWFj"; // Use a mesma chave configurada no Asaas

export async function POST(req: NextRequest) {
  try {
    // Ler o corpo da requisição como texto
    const body = await req.text();
    const signature = req.headers.get("Asaas-Signature");

    if (!signature) {
      return NextResponse.json({ error: "Assinatura não encontrada" }, { status: 401 });
    }

    // Gerar o HMAC-SHA256
    const hash = crypto
      .createHmac("sha256", ASAAS_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    // Comparar o hash gerado com a assinatura
    if (hash !== signature) {
      return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
    }

    // Se a assinatura for válida, processar o evento
    const event = JSON.parse(body);
    console.log("Webhook recebido:", event);

    if (event.event === "PAYMENT_RECEIVED") {
      console.log("Pagamento recebido:", event.payment);
      // Atualize o status do pagamento no seu banco de dados
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json({ error: "Erro ao processar webhook" }, { status: 500 });
  }
}