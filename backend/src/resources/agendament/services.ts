import { prisma } from "../../lib/prisma";


export const getAllAgendaments = async () => {
  return prisma.agendament.findMany();
};

export const createAgendament = async (agendamentData: {
  userId: number | string; // userId pode ser tanto string (googleId) quanto número (ID do usuário)
  professionalId: number;
  serviceId: number;
  appointmentDate: string;
  appointmentTime: string;
}) => {
  const { userId, professionalId, serviceId, appointmentDate, appointmentTime } = agendamentData;

  // Verificar se o userId é um número ou uma string
  let userExists;
  if (typeof userId === 'number') {
    // Se for um número, é um ID de usuário
    userExists = await prisma.user.findUnique({
      where: { id: userId },
    });
  } else if (typeof userId === 'string') {
    // Se for uma string, é um googleId
    userExists = await prisma.user.findUnique({
      where: { googleId: userId }, // Busca pelo googleId
    });
  }

  // Verificar se o usuário foi encontrado
  if (!userExists) {
    throw new Error(`Usuário com ${typeof userId === 'string' ? `googleId ${userId}` : `ID ${userId}`} não encontrado.`);
  }

  // Verificar se o profissional e o serviço existem
  const [professionalExists, serviceExists] = await Promise.all([
    prisma.user.findUnique({ where: { id: professionalId } }),
    prisma.services.findUnique({ where: { id: serviceId } }),
  ]);

  if (!professionalExists) {
    throw new Error(`Profissional com ID ${professionalId} não encontrado.`);
  }

  if (!serviceExists) {
    throw new Error(`Serviço com ID ${serviceId} não encontrado.`);
  }

  // Criar o agendamento
  return prisma.agendament.create({
    data: {
      userId: userExists.id, // Sempre usamos o ID numérico do usuário
      professionalId,
      serviceId,
      appointmentDate,
      appointmentTime,
    },
  });
};

