import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";


const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET || "uma-chave-secreta-aleatoria"

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new Error("Usuário não encontrado")
  }

  const isPasswordValid = await bcrypt.compare(password, user?.password ??'')

  if (!isPasswordValid) {
    throw new Error("Credenciais inválidas")
  }

  const accessToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" })

  const refreshToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" })

  return {
    name: user.name,
    email: user.email,
    accessToken,
    refreshToken,
  }
}

export const googleAuth = async (req: Request, res: Response) => {
  const { name, email, image, googleId } = req.body;
  
  try {
    let user = await prisma.user.findFirst({
      where: { 
        OR: [
          { email },
          { googleId }
        ]
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          image,
          googleId,
          role: 'client',
        },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          image,
          googleId,
        },
      });
    }

    // Retorne o ID numérico claramente
    res.json({ 
      user: {
        id: user.id,  // Aqui é o ID numérico do banco de dados
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro na autenticação do Google:', error);
    res.status(500).json({ error: 'Erro na autenticação' });
  }
};