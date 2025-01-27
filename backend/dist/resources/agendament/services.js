"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgendament = exports.getAllAgendaments = void 0;
const prisma_1 = require("../../lib/prisma");
const getAllAgendaments = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.agendament.findMany();
});
exports.getAllAgendaments = getAllAgendaments;
const createAgendament = (agendamentData) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, professionalId, serviceId, appointmentDate, appointmentTime } = agendamentData;
    // Verificar se o userId é um número ou uma string
    let userExists;
    if (typeof userId === 'number') {
        // Se for um número, é um ID de usuário
        userExists = yield prisma_1.prisma.user.findUnique({
            where: { id: userId },
        });
    }
    else if (typeof userId === 'string') {
        // Se for uma string, é um googleId
        userExists = yield prisma_1.prisma.user.findUnique({
            where: { googleId: userId }, // Busca pelo googleId
        });
    }
    // Verificar se o usuário foi encontrado
    if (!userExists) {
        throw new Error(`Usuário com ${typeof userId === 'string' ? `googleId ${userId}` : `ID ${userId}`} não encontrado.`);
    }
    // Verificar se o profissional e o serviço existem
    const [professionalExists, serviceExists] = yield Promise.all([
        prisma_1.prisma.user.findUnique({ where: { id: professionalId } }),
        prisma_1.prisma.services.findUnique({ where: { id: serviceId } }),
    ]);
    if (!professionalExists) {
        throw new Error(`Profissional com ID ${professionalId} não encontrado.`);
    }
    if (!serviceExists) {
        throw new Error(`Serviço com ID ${serviceId} não encontrado.`);
    }
    // Criar o agendamento
    return prisma_1.prisma.agendament.create({
        data: {
            userId: userExists.id, // Sempre usamos o ID numérico do usuário
            professionalId,
            serviceId,
            appointmentDate,
            appointmentTime,
        },
    });
});
exports.createAgendament = createAgendament;
