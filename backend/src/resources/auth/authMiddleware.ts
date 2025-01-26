import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "wd2e2adwua3215nAXW@_dw2XDauUNDW";

export interface UserPayload {
  userId: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: "Token não fornecido!" });
    return; 
  }

  const token = authHeader.split(" ")[1];
  console.log("token", token)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Erro na verificação do token:", error);
    res.status(403).json({ message: "Token inválido" });
    return; 
  }
};

export default authenticateJWT;
