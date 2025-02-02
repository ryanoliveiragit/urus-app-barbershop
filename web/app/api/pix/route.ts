import { NextRequest, NextResponse } from "next/server";

const ASAAS_API_KEY = "$aact_MzkwODA2MWY2OGM3MWRlMDU2NWM3MzJlNzZmNGZhZGY6OmIxMGFhYmUxLTZlNWUtNGEyNi04ZTU3LTIzNDRlM2RiOGM4Nzo6JGFhY2hfNWFlMjcyOWYtZDhmMC00YTcwLWI2OGEtY2YyNGNmNTJhOWU4";
const ASAAS_API_URL = "https://www.asaas.com/api/v3/payments";


export async function POST(req: NextRequest) {
  const { name, value } = await req.json();

  
  try {
    const response = await fetch(ASAAS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access_token": ASAAS_API_KEY!,
      },
      body: JSON.stringify({
        customer: {
          name,
          cpfCnpj: "47379575856", // Enviar CPF/CNPJ formatado
        },
        billingType: "PIX",
        value,
        dueDate: new Date().toISOString().split("T")[0],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors ? JSON.stringify(data.errors) : "Erro na API");
    }

    return NextResponse.json({
      pixQrCode: data.invoiceUrl, // URL com QR Code PIX
      pixCopyPaste: data.pixCopyPaste, // Código Copia e Cola
    });
  } catch (error) {
    console.error("Erro ao criar cobrança PIX:", error);
    return NextResponse.json({ error: "Erro ao criar pagamento" }, { status: 500 });
  }
}
