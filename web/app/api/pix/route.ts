// app/api/pix/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const payload = {
    addressKey: "3dfecdd0-8598-4b93-bff7-e9a9ca252ced",
    description: "teste",
    value: 1,
  };

  try {
    const response = await fetch('https://api.asaas.com/v3/pix/qrCodes/static', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access-token': `${process.env.ASAAS_WEBHOOK_SECRET}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar QR Code PIX');
    }

    const data = await response.json();
    return NextResponse.json({ qrCode: data.encodedImage }, { status: 200 });
  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json({ error: 'Erro ao gerar QR Code PIX' }, { status: 500 });
  }
}