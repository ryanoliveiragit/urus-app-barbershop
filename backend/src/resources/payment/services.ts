import { prisma } from "../../lib/prisma";

// Criar uma ordem de pagamento
export const createOrderPayment = async (orderData: { paymentId?: string; userId: string }) => {
  try {
    const newOrder = await prisma.orderPayment.create({
      data: {
        paymentId: orderData.paymentId || "",
        userId: orderData.userId,
      },
    });
    return newOrder;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao criar ordem de pagamento");
  }
};

// Buscar todas as ordens de pagamento
export const getAllOrderPayments = async () => {
  try {
    return await prisma.orderPayment.findMany();
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar ordens de pagamento");
  }
};

// Buscar uma ordem de pagamento por ID
export const getOrdersByUserId = async (userId: string) => {
  try {
    const orders = await prisma.orderPayment.findMany({
      where: { userId },
    });
    return orders;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar ordens de pagamento por userId");
  }
};

// Buscar ordens de pagamento pelo email do usuário
export const getOrdersByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new Error("Usuário não encontrado");
    return await prisma.orderPayment.findMany({ where: { userId: user.id.toString() } });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar ordens de pagamento");
  }
};

// Atualizar uma ordem de pagamento
export const updateOrderPayment = async (updateData: {
  orderId: number;
  paymentId?: string;
  userId?: string;
}) => {
  try {
    const updatedOrder = await prisma.orderPayment.update({
      where: { id: updateData.orderId },
      data: {
        paymentId: updateData.paymentId,
        userId: updateData.userId,
      },
    });
    return updatedOrder;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao atualizar a ordem de pagamento");
  }
};

// Deletar uma ordem de pagamento
export const deleteOrderPayment = async (orderId: number) => {
  try {
    await prisma.orderPayment.delete({ where: { id: orderId } });
    return { message: "Ordem de pagamento deletada com sucesso" };
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao deletar a ordem de pagamento");
  }
};