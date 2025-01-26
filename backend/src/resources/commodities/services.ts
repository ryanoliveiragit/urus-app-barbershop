import { prisma } from "../../lib/prisma";

export const getAllCommodities = async () => {
  return prisma.commodities.findMany();
};

export const createCommodity = async (commodityData: any) => {
  return prisma.commodities.create({ data: commodityData });
};
