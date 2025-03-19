import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "seu-google-client-secret"

export interface UserPayload {
  userId: number;
  email: string;
  role: string;
  phone: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  console.log("Token recebido:",);
  if (!authHeader) {
    console.log("Cabeçalho de autorização ausente");
    res.status(401).json({ message: "Token não fornecido!" });
    return; 
  }

  const token = authHeader.split(" ")[1];
  console.log("Token recebido:", token);
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    console.log("Token decodificado:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Erro na verificação do token:", error);
    if (error instanceof jwt.JsonWebTokenError) {
      console.log("Tipo de erro JWT:", error.name);
    }
    res.status(403).json({ message: "Token inválido" });
    return; 
  }
};