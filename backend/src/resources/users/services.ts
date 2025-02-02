import { PrismaClient } from "@prisma/client";


export const getAllUsers = async () => {
  return prisma.user.findMany();
};
const prisma = new PrismaClient({
  log: ['query'],
});

export const getAllBarbers = async () => {
  return await prisma.user.findMany({
    where: {
      role: 'professional',
    },
    select: {
      id: true, 
      name: true,
      specialty: true,
      email: true,
      image: true
    },
  });
};
export const createUser = async (userData: any) => {
  return prisma.user.create({ data: userData });
};