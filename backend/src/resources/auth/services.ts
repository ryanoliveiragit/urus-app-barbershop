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
  console.error('bateu');
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
      // Criar novo usuário
      user = await prisma.user.create({
        data: {
          name,
          email,
          image,
          googleId,
          role: 'client', // Definindo o papel padrão como cliente
        },
      });
      console.log('Usuário criado:', user);
    } else {
      // Atualizar informações do usuário existente
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          image,
          googleId,
        },
      });
    }

    const token = jwt.sign({
      userId: user.id,
      email: user.email,
      role: user.role,
    }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ user, token });
  } catch (error) {
    console.error('Erro na autenticação do Google:', error);
    res.status(500).json({ error: 'Erro na autenticação' });
  }
};
