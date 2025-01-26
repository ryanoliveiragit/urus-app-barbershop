import { Request, Response } from "express";
import { createSubscription, getAllSubscriptions } from "./services";


export const getSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await getAllSubscriptions();
    res.status(200).json(subscriptions);
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao obter assinaturas" });
  }
};

export const createNewSubscription = async (req: Request, res: Response) => {
  try {
    const { plan, userId } = req.body;
    const newSubscription = await createSubscription({ plan, userId });
    res.status(201).json(newSubscription);
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao criar assinatura" });
  }
};
