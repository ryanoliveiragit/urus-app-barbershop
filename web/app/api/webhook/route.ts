import { NextRequest } from 'next/server';
import crypto from 'crypto';

export const POST = async (req: NextRequest) => {
  try {
    // Obtém o raw body manualmente
    const rawBody = await req.text();
    const signature = req.headers.get('asaas-signature');

    // Verifica a assinatura do webhook
    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
      return new Response(JSON.stringify({ message: 'Invalid signature' }), {
        status: 401,
      });
    }

    // Converte o raw body para JSON
    const event = JSON.parse(rawBody);
    const paymentStatus: string = event?.status || 'Status não encontrado';

    console.log('Status do pagamento:', paymentStatus);

    return new Response(JSON.stringify({ paymentStatus }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
};

// Função para verificar a assinatura do webhook
function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.ASAAS_WEBHOOK_SECRET || '';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody);
  const digest = hmac.digest('hex');

  return crypto.timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(signature, 'hex'));
}
