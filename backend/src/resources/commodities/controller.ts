import { Request, Response } from "express";
import { createCommodity, getAllCommodities } from "./services";

export const getCommodities = async (req: Request, res: Response) => {
  try {
    const commodities = await getAllCommodities();
    res.status(200).json(commodities);
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao obter itens" });
  }
};

export const createNewCommodity = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;
    const newCommodity = await createCommodity({ name, price });
    res.status(201).json(newCommodity);
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao criar item" });
  }
};
