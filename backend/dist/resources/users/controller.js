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
exports.createNewUser = exports.getBarbers = exports.getUsers = void 0;
const services_1 = require("./services");
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, services_1.getAllUsers)();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao obter usuários" });
    }
});
exports.getUsers = getUsers;
const getBarbers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, services_1.getAllBarbers)();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao obter profissionais" });
    }
});
exports.getBarbers = getBarbers;
const createNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone, role } = req.body;
        const newUser = yield (0, services_1.createUser)({ name, email, password, phone, role });
        res.status(201).json(newUser);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar usuário" });
    }
});
exports.createNewUser = createNewUser;
