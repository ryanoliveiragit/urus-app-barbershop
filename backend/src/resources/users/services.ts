import { prisma } from "../../lib/prisma";

export const getAllUsers = async () => {
  return prisma.user.findMany();
};
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