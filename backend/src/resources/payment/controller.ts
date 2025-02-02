import { Request, Response } from "express";
import { createOrderPayment, getOrdersByEmail, updateOrderPayment, getAllOrderPayments, deleteOrderPayment, getOrdersByUserId } from "./services";
import { prisma } from "../../lib/prisma";

export const getOrdersByUserIdController = async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.params; // Recebe o userId como parâmetro da URL

  if (!userId) {
    return res.status(400).json({ error: "userId é obrigatório" });
  }

  try {
    // Busca as ordens do usuário pelo userId
    let orders = await getOrdersByUserId(userId);

    // Se não houver ordens, cria uma ordem padrão
    if (orders.length === 0) {
      const defaultOrder = {
        userId: userId,
        paymentId: "", // Valor padrão para paymentId
        // Adicione outros campos necessários aqui
      };

      // Cria a ordem padrão no banco de dados
      const createdOrder = await createOrderPayment(defaultOrder);

      // Retorna a ordem padrão criada
      return res.status(200).json([createdOrder]);
    }

    // Retorna as ordens existentes
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
};
export const getAllOrdersController = async (req: Request, res: Response): Promise<any> => {
  try {
    const orders = await getAllOrderPayments();
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar todas as ordens de pagamento" });
  }
};

export const getOrderByIdController = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const order = await getOrdersByUserId(id);
    if (!order) {
      return res.status(404).json({ message: "Ordem de pagamento não encontrada" });
    }
    return res.status(200).json(order);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar ordem de pagamento por ID" });
  }
};

export const createOrUpdateOrderPaymentController = async (req: Request, res: Response): Promise<any> => {
  if (req.method === 'PATCH' || req.method === 'POST') {
    const orderPaymentData = req.body;

    try {
      const result = await createOrderPayment(orderPaymentData);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: error.message || "Erro ao criar ou atualizar a ordem de pagamento" });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
};

export const updateOrderPaymentController = async (req: Request, res: Response): Promise<any> => {
  if (req.method === 'PATCH') {
    const { id, ...updateData } = req.body;

    try {
      const updatedOrder = await updateOrderPayment({ orderId: id, ...updateData });
      return res.status(200).json(updatedOrder);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Erro ao atualizar a ordem de pagamento" });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
};

export const deleteOrderPaymentController = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    await deleteOrderPayment(Number(id));
    return res.status(200).json({ message: "Ordem de pagamento deletada com sucesso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao deletar ordem de pagamento" });
  }
};