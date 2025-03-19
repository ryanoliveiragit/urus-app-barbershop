import { prisma } from "../../lib/prisma";
import { sendEmailCanceledAgendament, sendEmailCreatedAgendament } from "../email/services";


export const getAllAgendaments = async () => {
  return prisma.agendament.findMany();
};

export const getAgendamentsByUserId = async (userId: string | number) => {
  // Verificar se o userId é um número ou uma string
  let userIdNumber: number;

  if (typeof userId === 'string') {
    // Se for string, primeiro tentamos buscar o usuário pelo googleId
    const user = await prisma.user.findUnique({
      where: { googleId: userId },
    });

    if (!user) {
      throw new Error(`Usuário com googleId ${userId} não encontrado.`);
    }

    userIdNumber = user.id;
  } else {
    // Se for número, usamos diretamente
    userIdNumber = userId;
  }

  // Buscar todos os agendamentos do usuário
  return prisma.agendament.findMany({
    where: {
      userId: userIdNumber
    },
    include: {
      professional: {
        select: {
          name: true,
          image: true,
          specialty: true
        }
      },
      service: {
        select: {
          name: true,
          price: true
        }
      }
    },
    orderBy: {
      appointmentDate: 'desc'
    }
  });
};

export const createAgendament = async (agendamentData: {
  userId: number; // userId pode ser tanto string (googleId) quanto número (ID do usuário)
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
  const create = await prisma.agendament.create({
    data: {
      userId: userExists.id, // Sempre usamos o ID numérico do usuário
      professionalId,
      serviceId,
      appointmentDate,
      appointmentTime,
    }
  })
  const sendEmail = await sendEmailCreatedAgendament(userId, create.id)
}

export const cancelAgendament = async (id: number) => {

  // Verificação se o agendamento existe
  const verifyAgendament = await prisma.agendament.findFirst({ where: { id } })

  if (!verifyAgendament) throw new Error(`O agendamento de id ${id} não existe`)

  try {
    // Envia o email e deleta o agendamento
    await sendEmailCanceledAgendament(verifyAgendament.userId, id)
    await prisma.agendament.delete({ where: { id } })
  } catch (err) {
    console.log(err)
    throw new Error('Erro ao cancelar agendamento')
  }

  // Notificar o cliente e o barbeiro do cancelamento do agendamento
}
