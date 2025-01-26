import { prisma } from "../../lib/prisma";


export const getAllAgendaments = async () => {
  return prisma.agendament.findMany();
};

export const createAgendament = async (agendamentData: any) => {
  const { userId, professionalId, serviceId, appointmentDate, appointmentTime } = agendamentData;

  // Verificar se o usuário existe
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    throw new Error(`Usuário com ID ${userId} não encontrado`);
  }

  // Verificar se o profissional existe
  const professionalExists = await prisma.user.findUnique({
    where: { id: professionalId },
  });

  if (!professionalExists) {
    throw new Error(`Profissional com ID ${professionalId} não encontrado`);
  }

  // Verificar se o serviço existe
  const serviceExists = await prisma.services.findUnique({
    where: { id: serviceId },
  });

  if (!serviceExists) {
    throw new Error(`Serviço com ID ${serviceId} não encontrado`);
  }

  // Criar o agendamento
  return prisma.agendament.create({
    data: {
      userId,
      professionalId,
      serviceId,
      appointmentDate,
      appointmentTime,
    },
  });
};
