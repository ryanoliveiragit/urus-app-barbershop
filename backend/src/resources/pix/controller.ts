// resources/pix/controller.ts
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import mercadopago from '../../config/mercadopago';
import { WebhookController } from '../webhook/controller';

// Interfaces
interface PixPaymentData {
  id: string;
  externalId: string;
  amount: number;
  description: string;
  customerId: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  qrCode: string;
  qrCodeBase64: string;
  createdAt: Date;
}

// Simulando um banco de dados para armazenar os pagamentos
// Em produção, use um banco de dados real
const pixPayments: Map<string, PixPaymentData> = new Map();

export class PixController {
  /**
   * Gera um código PIX para pagamento via Mercado Pago
   */
  static async generatePixCode(req: Request, res: Response): Promise<void> {
    try {
      console.log('Gerando código PIX:', req.body);
      const { amount, description, customerId, email = "cliente@exemplo.com", cpf = "12345678909" } = req.body;
      
      if (!amount || amount <= 0) {
        res.status(400).json({ error: 'Valor de pagamento inválido' });
        return;
      }

      // Gere um ID único para este pagamento
      const paymentId = uuidv4();
      
      try {
        // Criando um pagamento via API do Mercado Pago
        const paymentData = {
          transaction_amount: Number(amount),
          description: description || 'Pagamento via PIX',
          payment_method_id: 'pix',
          payer: {
            email: email,
            identification: {
              type: 'CPF',
              number: cpf
            }
          },
          notification_url: process.env.WEBHOOK_URL // URL para receber webhooks
        };

        // Usando a nova forma de criar pagamentos com o SDK atualizado
        const result = await mercadopago.payment.create({
          body: paymentData
        });
        
        if (!result || !result.id) {
          throw new Error('Falha ao criar pagamento no Mercado Pago');
        }

        // Extrair os dados do QR code do retorno do Mercado Pago
        const qrCode = result.point_of_interaction?.transaction_data?.qr_code || '';
        const qrCodeBase64 = result.point_of_interaction?.transaction_data?.qr_code_base64 || '';
        
        // Armazene as informações do pagamento
        pixPayments.set(paymentId, {
          id: paymentId,
          externalId: result.id.toString(),
          amount,
          description: description || 'Pagamento via PIX',
          customerId: customerId || 'anon',
          status: 'pending',
          qrCode,
          qrCodeBase64,
          createdAt: new Date()
        });

        // Retorne os dados necessários para o frontend
        res.status(201).json({
          paymentId,
          qrCode,
          qrCodeImage: qrCodeBase64,
          externalId: result.id,
          expiresAt: new Date(Date.now() + 30 * 60000) // 30 minutos de expiração
        });
        
        console.log(`✅ Pagamento PIX ${paymentId} criado com sucesso. External ID: ${result.id}`);
      } catch (apiError: any) {
        console.error('Erro na API do Mercado Pago:', apiError.message);
        if (apiError.response) {
          console.error('Detalhes:', apiError.response.data);
        }
        res.status(502).json({ 
          error: 'Falha ao comunicar com a API do Mercado Pago', 
          details: apiError.message
        });
      }
    } catch (error: any) {
      console.error('Erro ao gerar código PIX:', error.message);
      res.status(500).json({ error: 'Falha ao gerar o código PIX' });
    }
  }

  /**
   * Verifica o status atual de um pagamento no Mercado Pago
   */
  static async checkPaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { paymentId } = req.params;
      
      // Verifique se o pagamento existe
      if (!pixPayments.has(paymentId)) {
        res.status(404).json({ error: 'Pagamento não encontrado' });
        return;
      }

      const paymentInfo = pixPayments.get(paymentId)!;
      
      try {
        // Consulta o status do pagamento no Mercado Pago usando a nova API
        const result = await mercadopago.payment.get({ id: paymentInfo.externalId });
        
        // Mapeia o status do Mercado Pago para o nosso formato
        const statusMap: { [key: string]: 'pending' | 'approved' | 'rejected' | 'cancelled' } = {
          pending: 'pending',
          approved: 'approved',
          authorized: 'approved',
          in_process: 'pending',
          in_mediation: 'pending',
          rejected: 'rejected',
          cancelled: 'cancelled',
          refunded: 'cancelled',
          charged_back: 'cancelled'
        };
        
        const newStatus = statusMap[result.status ?? ''] || 'pending';

        // Atualize o status local se tiver mudado
        if (newStatus !== paymentInfo.status) {
          paymentInfo.status = newStatus;
          pixPayments.set(paymentId, paymentInfo);
          
          // Se o pagamento foi aprovado, notifique via WebSocket
          if (newStatus === 'approved') {
            WebhookController.notifyPaymentApproved(paymentInfo);
          }
        }

        res.json({
          paymentId,
          status: paymentInfo.status,
          isPaid: paymentInfo.status === 'approved',
          externalId: paymentInfo.externalId,
          details: {
            mpStatus: result.status,
            mpStatusDetail: result.status_detail,
            lastUpdated: result.date_last_updated
          }
        });
      } catch (apiError: any) {
        console.error('Erro ao consultar API do Mercado Pago:', apiError.message);
        // Se não conseguir consultar a API, retorne o status salvo localmente
        res.json({
          paymentId,
          status: paymentInfo.status,
          isPaid: paymentInfo.status === 'approved',
          error: 'Não foi possível atualizar o status'
        });
      }
    } catch (error: any) {
      console.error('Erro ao verificar status do pagamento:', error.message);
      res.status(500).json({ error: 'Falha ao verificar status do pagamento' });
    }
  }

  /**
   * Processa webhook de confirmação de pagamento do Mercado Pago
   */
  static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      console.log('Webhook do Mercado Pago recebido:', req.body);
      
      // O formato do webhook do Mercado Pago pode variar
      // Documentação: https://www.mercadopago.com.br/developers/pt/guides/notifications/webhooks
      const { type, data } = req.body;
      
      // Verifica se é uma notificação de pagamento
      if (type !== 'payment') {
        console.log(`Webhook ignorado: tipo ${type} não é 'payment'`);
        res.status(200).json({ message: 'Webhook recebido, mas não processado (não é pagamento)' });
        return;
      }
      
      if (!data || !data.id) {
        res.status(400).json({ error: 'Payload de webhook inválido' });
        return;
      }
      
      // Consulta os detalhes do pagamento no Mercado Pago
      try {
        const paymentId = data.id;
        const result = await mercadopago.payment.get({ id: paymentId.toString() });
        
        // Busca o pagamento interno correspondente
        let internalPaymentId: string | null = null;
        let paymentInfo: PixPaymentData | undefined;
        
        for (const [key, value] of pixPayments.entries()) {
          if (value.externalId === paymentId.toString()) {
            internalPaymentId = key;
            paymentInfo = value;
            break;
          }
        }
        
        if (!paymentInfo || !internalPaymentId) {
          console.log(`Pagamento ${paymentId} não encontrado no sistema`);
          // Responde com 200 para o Mercado Pago não reenviar a notificação
          res.status(200).json({ message: 'Webhook processado (pagamento não encontrado)' });
          return;
        }
        
        // Mapeia o status do Mercado Pago
        const statusMap: { [key: string]: 'pending' | 'approved' | 'rejected' | 'cancelled' } = {
          pending: 'pending',
          approved: 'approved',
          authorized: 'approved',
          in_process: 'pending',
          in_mediation: 'pending',
          rejected: 'rejected',
          cancelled: 'cancelled',
          refunded: 'cancelled',
          charged_back: 'cancelled'
        };
        
        const newStatus = (result.status && typeof result.status === 'string' && result.status in statusMap) 
        ? statusMap[result.status] 
        : 'pending';
        
        // Atualiza o status do pagamento
        if (paymentInfo.status !== newStatus) {
          paymentInfo.status = newStatus;
          pixPayments.set(internalPaymentId, paymentInfo);
          
          console.log(`Status do pagamento ${internalPaymentId} atualizado para ${newStatus}`);
          
          // Se o pagamento foi aprovado, notifica via WebSocket
          if (newStatus === 'approved') {
            WebhookController.notifyPaymentApproved(paymentInfo);
          }
        }
        
        res.status(200).json({ message: 'Webhook processado com sucesso' });
      } catch (apiError: any) {
        console.error('Erro ao consultar pagamento no Mercado Pago:', apiError.message);
        // Responde com 200 para o Mercado Pago não reenviar a notificação
        res.status(200).json({ message: 'Webhook recebido, mas houve erro ao processar' });
      }
    } catch (error: any) {
      console.error('Erro ao processar webhook:', error.message);
      // Responde com 200 para o Mercado Pago não reenviar a notificação
      res.status(200).json({ message: 'Webhook recebido, mas houve erro ao processar' });
    }
  }
}