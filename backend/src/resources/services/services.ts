import { prisma } from "../../lib/prisma";

export const getAllServices = async () => {
  return prisma.services.findMany();
};
