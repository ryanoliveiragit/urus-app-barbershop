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
exports.createNewCommodity = exports.getCommodities = void 0;
const services_1 = require("./services");
const getCommodities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commodities = yield (0, services_1.getAllCommodities)();
        res.status(200).json(commodities);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao obter itens" });
    }
});
exports.getCommodities = getCommodities;
const createNewCommodity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price } = req.body;
        const newCommodity = yield (0, services_1.createCommodity)({ name, price });
        res.status(201).json(newCommodity);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar item" });
    }
});
exports.createNewCommodity = createNewCommodity;
