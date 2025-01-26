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
    // Verificar se o usuário existe
    const userExists = yield prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!userExists) {
        throw new Error(`Usuário com ID ${userId} não encontrado`);
    }
    // Verificar se o profissional existe
    const professionalExists = yield prisma_1.prisma.user.findUnique({
        where: { id: professionalId },
    });
    if (!professionalExists) {
        throw new Error(`Profissional com ID ${professionalId} não encontrado`);
    }
    // Verificar se o serviço existe
    const serviceExists = yield prisma_1.prisma.services.findUnique({
        where: { id: serviceId },
    });
    if (!serviceExists) {
        throw new Error(`Serviço com ID ${serviceId} não encontrado`);
    }
    // Criar o agendamento
    return prisma_1.prisma.agendament.create({
        data: {
            userId,
            professionalId,
            serviceId,
            appointmentDate,
            appointmentTime,
        },
    });
});
exports.createAgendament = createAgendament;
