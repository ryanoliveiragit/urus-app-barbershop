import { Request, Response } from "express";
import { getAllServices } from "./services";

export const getServices = async (req: Request, res: Response) => {
  try {
    const subscriptions = await getAllServices();
    res.status(200).json(subscriptions);
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao obter assinaturas" });
  }
};
