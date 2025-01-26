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
exports.createNewAgendament = exports.getAgendaments = void 0;
const services_1 = require("./services");
const getAgendaments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agendaments = yield (0, services_1.getAllAgendaments)();
        res.status(200).json(agendaments);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao obter agendamentos" });
    }
});
exports.getAgendaments = getAgendaments;
const createNewAgendament = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, professionalId, serviceId, appointmentDate, appointmentTime } = req.body;
        if (!userId || !professionalId || !serviceId || !appointmentDate || !appointmentTime) {
            return res.status(400).json({ error: "Todos os campos são obrigatórios." });
        }
        const newAgendament = yield (0, services_1.createAgendament)({
            userId,
            professionalId,
            serviceId,
            appointmentDate,
            appointmentTime,
        });
        return res.status(201).json(newAgendament);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro ao criar agendamento", message: error.message });
    }
});
exports.createNewAgendament = createNewAgendament;
