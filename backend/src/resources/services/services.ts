import { prisma } from "../../lib/prisma";

export const getAllServices = async () => {
  return prisma.services.findMany();
};
export const createServices= async (servicesData: any) => {
  return prisma.services.create({ data: servicesData });
};
