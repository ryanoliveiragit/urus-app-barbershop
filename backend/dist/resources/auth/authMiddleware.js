"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "wd2e2adwua3215nAXW@_dw2XDauUNDW";
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: "Token não fornecido!" });
        return;
    }
    const token = authHeader.split(" ")[1];
    console.log("token", token);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Erro na verificação do token:", error);
        res.status(403).json({ message: "Token inválido" });
        return;
    }
};
exports.default = authenticateJWT;
