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
exports.createUser = exports.getAllBarbers = exports.getAllUsers = void 0;
const prisma_1 = require("../../lib/prisma");
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.user.findMany();
});
exports.getAllUsers = getAllUsers;
const getAllBarbers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.user.findMany({
        where: {
            role: 'professional',
        },
        select: {
            id: true,
            name: true,
            specialty: true,
            email: true,
            image: true
        },
    });
});
exports.getAllBarbers = getAllBarbers;
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.user.create({ data: userData });
});
exports.createUser = createUser;
