import { Request, Response } from "express";
import { createUser, getAllBarbers, getAllUsers } from "./services";
import { prisma } from "../../lib/prisma";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/secrets";


export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao obter usuários" });
  }
};
export const getBarbers = async (req: Request, res: Response) => {
  try {
    const users = await getAllBarbers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao obter profissionais" });
  }
}
export const createNewUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const newUser = await createUser({ name, email, password, phone, role });
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
};


