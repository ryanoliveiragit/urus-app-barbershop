// config/mercadopago.ts
import { MercadoPagoConfig, Payment } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

// Obter o token de acesso do arquivo .env
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || '';

// Criar cliente do Mercado Pago com o token de acesso
const client = new MercadoPagoConfig({ accessToken });

// Criar instância de pagamento
const payment = new Payment(client);

// Exportar módulos do Mercado Pago
export default {
  client,
  payment
};