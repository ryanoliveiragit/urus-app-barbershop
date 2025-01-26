import { Request, Response } from "express";
import { createServices, getAllServices } from "./services";

export const getServices = async (req: Request, res: Response) => {
  try {
    const subscriptions = await getAllServices();
    res.status(200).json(subscriptions);
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao obter assinaturas" });
  }
};

export const createNewServices = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;
    const newService = await createServices({ name, price });
    res.status(201).json(newService);
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao criar serviço" });
  }
};
