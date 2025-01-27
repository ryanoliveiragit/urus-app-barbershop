"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "seu-google-client-secret";
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log("Token recebido:");
    if (!authHeader) {
        console.log("Cabeçalho de autorização ausente");
        res.status(401).json({ message: "Token não fornecido!" });
        return;
    }
    const token = authHeader.split(" ")[1];
    console.log("Token recebido:", token);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        console.log("Token decodificado:", decoded);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Erro na verificação do token:", error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.log("Tipo de erro JWT:", error.name);
        }
        res.status(403).json({ message: "Token inválido" });
        return;
    }
};
exports.authenticateJWT = authenticateJWT;
