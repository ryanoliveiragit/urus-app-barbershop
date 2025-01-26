import { prisma } from "../../lib/prisma";

export const getAllSubscriptions = async () => {
  return prisma.subscriptions.findMany();
};

export const createSubscription = async (subscriptionData: any) => {
  return prisma.subscriptions.create({ data: subscriptionData });
};
