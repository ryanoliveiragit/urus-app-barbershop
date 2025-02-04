import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false, // Desativa o bodyParser para capturar o raw body
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Obtém o raw body
    const rawBody = await getRawBody(req);
    const signature = req.headers['asaas-signature'] as string | undefined;

    // Verifica a assinatura do webhook
    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    // Converte o raw body para JSON
    const event = JSON.parse(rawBody.toString());

    // Obtém o status do pagamento
    const paymentStatus: string = event?.status || 'Status não encontrado';

    console.log('Status do pagamento:', paymentStatus);

    res.status(200).json({ paymentStatus });
  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Função para obter o raw body da requisição
async function getRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', (err) => reject(err));
  });
}

// Função para verificar a assinatura do webhook
function verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
  const secret = process.env.ASAAS_WEBHOOK_SECRET || '';
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(rawBody);
  const digest = hmac.digest('hex');

  return crypto.timingSafeEqual(Buffer.from(digest, 'hex'), Buffer.from(signature, 'hex'));
}
