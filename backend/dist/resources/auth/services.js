"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuth = exports.loginUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const jwt = __importStar(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "wd2e2adwua3215nAXW@_dw2XDauUNDW";
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error("Usuário não encontrado");
    }
    const isPasswordValid = yield bcrypt_1.default.compare(password, (_a = user === null || user === void 0 ? void 0 : user.password) !== null && _a !== void 0 ? _a : '');
    if (!isPasswordValid) {
        throw new Error("Credenciais inválidas");
    }
    const accessToken = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    return {
        name: user.name,
        email: user.email,
        accessToken,
        refreshToken,
    };
});
exports.loginUser = loginUser;
const googleAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, image, googleId } = req.body;
    console.error('bateu');
    try {
        let user = yield prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { googleId }
                ]
            },
        });
        if (!user) {
            // Criar novo usuário
            user = yield prisma.user.create({
                data: {
                    name,
                    email,
                    image,
                    googleId,
                    role: 'client', // Definindo o papel padrão como cliente
                },
            });
            console.log('Usuário criado:', user);
        }
        else {
            // Atualizar informações do usuário existente
            user = yield prisma.user.update({
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
    }
    catch (error) {
        console.error('Erro na autenticação do Google:', error);
        res.status(500).json({ error: 'Erro na autenticação' });
    }
});
exports.googleAuth = googleAuth;
